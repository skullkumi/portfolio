"use client";

import { useEffect, useRef, useState } from "react";
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
};

export function ShaderCanvas({
  className = "",
  scrollProgress,
  interactive = true,
  dprCap = 1.25,
}: ShaderCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const gl2 = canvas.getContext("webgl2", { antialias: false, alpha: false });
    const gl1 = gl2
      ? null
      : canvas.getContext("webgl", { antialias: false, alpha: false });
    const gl = gl2 ?? gl1;

    if (!gl) {
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
        const log = gl.getShaderInfoLog(s) ?? "unknown error";
        console.error("Shader compile:", log);
        setErrorMsg(log.slice(0, 120));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program) ?? "link error";
      setErrorMsg(log.slice(0, 120));
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

    let intersecting = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w < 2 || h < 2) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      mouseRef.current = {
        x: canvas.width * 0.5,
        y: canvas.height * 0.5,
      };
    };

    resize();
    requestAnimationFrame(resize);
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
    window.addEventListener("mousemove", onMove);

    const start = performance.now();
    const render = (now: number) => {
      rafRef.current = requestAnimationFrame(render);
      if (!intersecting || document.hidden) return;
      if (canvas.width > 0 && canvas.height > 0) {
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
        gl.uniform1f(uTime, (now - start) / 1000);
        if (uScroll) {
          gl.uniform1f(uScroll, scrollProgress?.current ?? 0);
        }
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    };
    rafRef.current = requestAnimationFrame(render);
    setErrorMsg(null);

    return () => {
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, [dprCap, interactive, scrollProgress]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
      {errorMsg && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0a0a12] p-4 text-center font-mono text-[10px] text-accent-magenta">
          <span>shader error</span>
          <span className="max-w-xs text-muted">{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
