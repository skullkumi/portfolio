"use client";

import { useEffect, useRef } from "react";
import { VERTEX_SHADER_WEBGL2 } from "@/shaders/iEatPixels";

type ShaderRunnerProps = {
  fragmentWebGL2: string;
  fragmentWebGL1: string;
  className?: string;
  dprCap?: number;
};

export function ShaderRunner({
  fragmentWebGL2,
  fragmentWebGL1,
  className = "",
  dprCap = 1.5,
}: ShaderRunnerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const gl2 = canvas.getContext("webgl2", { antialias: false, alpha: false });
    const gl1 = gl2
      ? null
      : canvas.getContext("webgl", { antialias: false, alpha: false });
    const gl = gl2 ?? gl1;
    if (!gl) return;

    const isWebGL2 = gl === gl2;
    const vsSource = isWebGL2
      ? VERTEX_SHADER_WEBGL2
      : `attribute vec2 a_position; void main(){ gl_Position=vec4(a_position,0.0,1.0); }`;
    const fsSource = isWebGL2 ? fragmentWebGL2 : fragmentWebGL1;

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
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
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
    const uTime = gl.getUniformLocation(program, "u_time");

    let raf = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w < 2 || h < 2) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);

    const start = performance.now();
    const render = (now: number) => {
      if (canvas.width > 0 && canvas.height > 0) {
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, (now - start) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [dprCap, fragmentWebGL1, fragmentWebGL2]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
