"use client";

import { useEffect, useRef, useState } from "react";
import {
  adaptQualityScale,
  detectShaderQuality,
  type ShaderQualityConfig,
} from "@/lib/shaderQuality";
import {
  I_EAT_PIXELS_SHADER,
  I_EAT_PIXELS_SHADER_WEBGL1,
  VERTEX_SHADER_WEBGL2,
} from "@/shaders/iEatPixels";

type ShaderCanvasProps = {
  className?: string;
  scrollProgress?: React.MutableRefObject<number>;
  interactive?: boolean;
  dprCap?: number;
  fpsCap?: number;
};

function ShaderFallback({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a0818_0%,_#100810_45%,_#08060a_100%)] ${className}`}
      aria-hidden
    />
  );
}

export function ShaderCanvas({
  className = "",
  scrollProgress,
  interactive = false,
}: ShaderCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const qualityRef = useRef<ShaderQualityConfig | null>(null);
  const scaleRef = useRef(1);
  const marchRef = useRef(12);
  const innerRef = useRef(6);
  const fpsRef = useRef(30);
  const frameTimesRef = useRef<number[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [useShader, setUseShader] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setUseShader(false);
      return;
    }

    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const baseQuality = detectShaderQuality();
    qualityRef.current = baseQuality;
    scaleRef.current = baseQuality.qualityScale;
    marchRef.current = baseQuality.marchSteps;
    innerRef.current = baseQuality.innerSteps;
    fpsRef.current = baseQuality.fpsCap;

    const gl2 = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    const gl1 = gl2
      ? null
      : canvas.getContext("webgl", {
          antialias: false,
          alpha: false,
          powerPreference: "low-power",
        });
    const gl = gl2 ?? gl1;

    if (!gl) {
      setUseShader(false);
      setErrorMsg("WebGL not supported");
      return;
    }

    const isWebGL2 = gl === gl2;
    const vsSource = isWebGL2
      ? VERTEX_SHADER_WEBGL2
      : `attribute vec2 a_position; void main(){ gl_Position=vec4(a_position,0.0,1.0); }`;
    const fsSource = isWebGL2 ? I_EAT_PIXELS_SHADER : I_EAT_PIXELS_SHADER_WEBGL1;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader compile:", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      setUseShader(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setUseShader(false);
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uScroll = gl.getUniformLocation(program, "u_scroll");
    const uMaxSteps = gl.getUniformLocation(program, "u_maxSteps");
    const uInnerSteps = gl.getUniformLocation(program, "u_innerSteps");
    const uPixelScale = gl.getUniformLocation(program, "u_pixelScale");

    const isDesktop = !window.matchMedia("(pointer: coarse)").matches;
    const basePixelScale = isDesktop ? 2.0 : 1.0;

    let intersecting = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    const resize = () => {
      const q = qualityRef.current ?? baseQuality;
      const dpr = Math.min(window.devicePixelRatio || 1, q.dprCap);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w < 2 || h < 2) return;
      const scale = scaleRef.current;
      canvas.width = Math.max(2, Math.floor(w * dpr * scale));
      canvas.height = Math.max(2, Math.floor(h * dpr * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      mouseRef.current = {
        x: canvas.width * 0.5,
        y: canvas.height * 0.5,
      };
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);

    const onMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1) return;
      const dpr = canvas.width / rect.width;
      mouseRef.current = {
        x: (e.clientX - rect.left) * dpr,
        y: (rect.height - (e.clientY - rect.top)) * dpr,
      };
    };
    if (interactive) window.addEventListener("mousemove", onMove);

    let lastDraw = performance.now();
    const start = performance.now();
    let adaptCheckAt = 0;

    const render = (now: number) => {
      rafRef.current = requestAnimationFrame(render);

      const scrolledPast = (scrollProgress?.current ?? 0) > 0.12;
      if (!intersecting || document.hidden || scrolledPast) return;

      const frameInterval = 1000 / fpsRef.current;
      if (now - lastDraw < frameInterval) return;

      const frameMs = now - lastDraw;
      lastDraw = now;

      if (now - adaptCheckAt > 900) {
        adaptCheckAt = now;
        const samples = frameTimesRef.current;
        if (samples.length >= 4) {
          const avg =
            samples.reduce((sum, v) => sum + v, 0) / samples.length;
          const adapted = adaptQualityScale(
            qualityRef.current ?? baseQuality,
            scaleRef.current,
            avg,
            frameInterval,
          );
          const prevScale = scaleRef.current;
          scaleRef.current = adapted.scale;
          marchRef.current = adapted.marchSteps;
          innerRef.current = adapted.innerSteps;
          fpsRef.current = adapted.fpsCap;
          if (Math.abs(prevScale - adapted.scale) > 0.04) resize();
        }
        frameTimesRef.current = [];
      } else if (frameMs > 0 && frameMs < 200) {
        const bucket = frameTimesRef.current;
        bucket.push(frameMs);
        if (bucket.length > 12) bucket.shift();
      }

      if (canvas.width > 0 && canvas.height > 0) {
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
        gl.uniform1f(uTime, (now - start) / 1000);
        if (uScroll) gl.uniform1f(uScroll, scrollProgress?.current ?? 0);
        if (uMaxSteps) gl.uniform1f(uMaxSteps, marchRef.current);
        if (uInnerSteps) gl.uniform1f(uInnerSteps, innerRef.current);
        if (uPixelScale) gl.uniform1f(uPixelScale, basePixelScale);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    };
    rafRef.current = requestAnimationFrame(render);
    setErrorMsg(null);

    return () => {
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
      ro.disconnect();
      if (interactive) window.removeEventListener("mousemove", onMove);
    };
  }, [interactive, scrollProgress]);

  if (!useShader) {
    return <ShaderFallback className={className} />;
  }

  return (
    <div ref={wrapRef} className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ imageRendering: "auto" }}
      />
      {errorMsg && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0a0a12] p-4 text-center font-mono text-[10px] text-accent-magenta">
          <span>shader error</span>
          <span className="max-w-xs text-muted">{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
