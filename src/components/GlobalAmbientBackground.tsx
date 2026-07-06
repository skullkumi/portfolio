"use client";

import {
  AMBIENT_DEPTH_SHADER,
  AMBIENT_DEPTH_SHADER_WEBGL1,
} from "@/shaders/ambientDepth";
import { ShaderRunner } from "./ShaderRunner";

export function GlobalAmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    >
      <ShaderRunner
        fragmentWebGL2={AMBIENT_DEPTH_SHADER}
        fragmentWebGL1={AMBIENT_DEPTH_SHADER_WEBGL1}
        className="absolute inset-0 opacity-70"
        dprCap={1.25}
      />
      <div className="absolute inset-0 bg-[#04040a]/55" />
    </div>
  );
}
