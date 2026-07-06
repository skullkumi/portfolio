// Ambient depth field — aurora bands, wormhole rings, star field
// Inspired by @XorDev's layered sin/tunnel aesthetics

export const AMBIENT_DEPTH_SHADER = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  float t = u_time * 0.18;

  vec3 col = vec3(0.018, 0.022, 0.055);

  float aurora = 0.0;
  aurora += sin(p.x * 2.8 + t + sin(p.y * 4.0 + t * 1.1) * 1.8);
  aurora += sin(p.y * 2.2 - t * 0.8 + sin(p.x * 3.5 - t) * 1.2) * 0.7;
  aurora += sin((p.x + p.y) * 3.0 + t * 1.4) * 0.4;
  aurora = smoothstep(-0.2, 1.1, aurora * 0.35);

  col += vec3(0.04, 0.28, 0.55) * aurora * 0.28;
  col += vec3(0.55, 0.1, 0.45) * aurora * aurora * 0.18;
  col += vec3(0.9, 0.45, 0.08) * pow(aurora, 3.0) * 0.1;

  float r = length(p);
  float ring = sin(r * 14.0 - t * 3.5) * sin(r * 9.0 + t * 2.2);
  ring = smoothstep(0.25, 0.85, ring) * smoothstep(1.35, 0.15, r);
  col += vec3(0.0, 0.85, 0.72) * ring * 0.09;
  col += vec3(0.65, 0.2, 0.9) * ring * ring * 0.05;

  float gy = p.y + 0.42;
  if (gy > 0.02) {
    float depth = 1.0 / gy;
    vec2 gp = vec2(p.x * depth, depth + t * 1.8);
    float grid = step(0.93, fract(gp.x * 0.12)) + step(0.93, fract(gp.y * 0.12));
    float fade = smoothstep(2.8, 0.25, depth) * 0.1;
    col += vec3(0.0, 0.65, 0.58) * grid * fade;
    col += vec3(0.45, 0.15, 0.75) * grid * fade * 0.35;
  }

  vec2 starUV = floor(gl_FragCoord.xy * 0.32);
  float star = hash(starUV);
  if (star > 0.991) {
    float twinkle = sin(u_time * (star * 18.0) + star * 6.283) * 0.5 + 0.5;
    vec3 starCol = mix(vec3(0.6, 0.8, 1.0), vec3(1.0, 0.5, 0.8), star);
    col += starCol * twinkle * 0.55;
  }

  float drift = sin(p.x * 6.0 + t * 2.0 + sin(p.y * 8.0)) * 0.5 + 0.5;
  col += vec3(0.15, 0.05, 0.35) * drift * smoothstep(0.8, 0.0, r) * 0.12;

  col += (hash(gl_FragCoord.xy + t) - 0.5) * 0.018;

  fragColor = vec4(col, 1.0);
}
`;

export const AMBIENT_DEPTH_SHADER_WEBGL1 = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  float t = u_time * 0.18;

  vec3 col = vec3(0.018, 0.022, 0.055);

  float aurora = 0.0;
  aurora += sin(p.x * 2.8 + t + sin(p.y * 4.0 + t * 1.1) * 1.8);
  aurora += sin(p.y * 2.2 - t * 0.8 + sin(p.x * 3.5 - t) * 1.2) * 0.7;
  aurora += sin((p.x + p.y) * 3.0 + t * 1.4) * 0.4;
  aurora = smoothstep(-0.2, 1.1, aurora * 0.35);

  col += vec3(0.04, 0.28, 0.55) * aurora * 0.28;
  col += vec3(0.55, 0.1, 0.45) * aurora * aurora * 0.18;
  col += vec3(0.9, 0.45, 0.08) * pow(aurora, 3.0) * 0.1;

  float r = length(p);
  float ring = sin(r * 14.0 - t * 3.5) * sin(r * 9.0 + t * 2.2);
  ring = smoothstep(0.25, 0.85, ring) * smoothstep(1.35, 0.15, r);
  col += vec3(0.0, 0.85, 0.72) * ring * 0.09;
  col += vec3(0.65, 0.2, 0.9) * ring * ring * 0.05;

  float gy = p.y + 0.42;
  if (gy > 0.02) {
    float depth = 1.0 / gy;
    vec2 gp = vec2(p.x * depth, depth + t * 1.8);
    float grid = step(0.93, fract(gp.x * 0.12)) + step(0.93, fract(gp.y * 0.12));
    float fade = smoothstep(2.8, 0.25, depth) * 0.1;
    col += vec3(0.0, 0.65, 0.58) * grid * fade;
    col += vec3(0.45, 0.15, 0.75) * grid * fade * 0.35;
  }

  vec2 starUV = floor(gl_FragCoord.xy * 0.32);
  float star = hash(starUV);
  if (star > 0.991) {
    float twinkle = sin(u_time * (star * 18.0) + star * 6.283) * 0.5 + 0.5;
    vec3 starCol = mix(vec3(0.6, 0.8, 1.0), vec3(1.0, 0.5, 0.8), star);
    col += starCol * twinkle * 0.55;
  }

  float drift = sin(p.x * 6.0 + t * 2.0 + sin(p.y * 8.0)) * 0.5 + 0.5;
  col += vec3(0.15, 0.05, 0.35) * drift * smoothstep(0.8, 0.0, r) * 0.12;

  col += (hash(gl_FragCoord.xy + t) - 0.5) * 0.018;

  gl_FragColor = vec4(col, 1.0);
}
`;
