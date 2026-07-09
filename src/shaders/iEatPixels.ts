// "I Eat Pixels" by @XorDev — adapted for WebGL2 with quality uniforms

export const I_EAT_PIXELS_SHADER = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_scroll;
uniform float u_maxSteps;
uniform float u_innerSteps;
uniform float u_pixelScale;

out vec4 fragColor;

void main() {
  vec2 fragCoord = gl_FragCoord.xy;

  float px = max(1.0, u_pixelScale + floor(u_scroll * 2.0));
  fragCoord = floor(fragCoord / px) * px + px * 0.5;

  float t = u_time;
  float z = 0.0;
  float d = 0.0;
  float s = 0.0;
  vec3 col = vec3(0.0);

  for (float i = 0.0; max(d, i++) < u_maxSteps; col += (cos(s - 0.4 * u_time + vec3(0.0, 1.0, 8.0)) + 1.1) / d) {
    vec3 p = z * normalize(vec3(2.0 * fragCoord, 0.0) - u_resolution.xyy);
    vec3 a = normalize(cos(vec3(5.0, 0.0, 1.0) + t / 4.0));
    p.z += 2.8;
    a = a * dot(a, p) - cross(a, p);

    for (d = 1.6; d++ < u_innerSteps; ) {
      a -= sin(floor(a * d + 0.5) + t).zxy / d;
    }

    vec3 v = abs(a) - 0.58;
    s = length(max(v, 0.0)) + min(max(v.x, max(v.y, v.z)), 0.0);
    z += d = max(s, 0.02);
  }

  col = tanh(col / 220.0);
  col *= 1.9;

  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  col *= 0.94 + 0.06 * sin(uv.y * u_resolution.y * 1.2 + u_time * 2.0);
  col *= smoothstep(2.1, 0.5, length(uv - 0.5) * 1.0);

  fragColor = vec4(pow(max(col, vec3(0.0)), vec3(0.88)), 1.0);
}
`;

export const I_EAT_PIXELS_SHADER_WEBGL1 = `
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_scroll;
uniform float u_maxSteps;
uniform float u_innerSteps;
uniform float u_pixelScale;

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  float px = max(1.0, u_pixelScale + floor(u_scroll * 2.0));
  fragCoord = floor(fragCoord / px) * px + px * 0.5;

  float t = u_time;
  float z = 0.0;
  float d = 0.0;
  float s = 0.0;
  vec3 col = vec3(0.0);
  float maxSteps = min(u_maxSteps, 8.0);
  float maxInner = min(u_innerSteps, 4.0);

  for (int i = 0; i < 8; i++) {
    if (float(i) >= maxSteps) break;

    vec3 p = z * normalize(vec3(2.0 * fragCoord, 0.0) - u_resolution.xyy);
    vec3 a = normalize(cos(vec3(5.0, 0.0, 1.0) + t / 4.0));
    p.z += 2.8;
    a = a * dot(a, p) - cross(a, p);

    for (int j = 0; j < 4; j++) {
      float fd = float(j) + 2.0;
      if (fd >= maxInner) break;
      a -= sin(floor(a * fd + 0.5) + t).zxy / fd;
    }

    vec3 v = abs(a) - 0.58;
    s = length(max(v, 0.0)) + min(max(v.x, max(v.y, v.z)), 0.0);
    d = max(s, 0.02);
    z += d;
    col += (cos(s - 0.4 * u_time + vec3(0.0, 1.0, 8.0)) + 1.1) / d;
  }

  col = col / (1.0 + abs(col) / 220.0);
  col *= 1.9;
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  col *= 0.94 + 0.06 * sin(uv.y * u_resolution.y * 1.2 + u_time * 2.0);
  col *= smoothstep(2.1, 0.5, length(uv - 0.5) * 1.0);
  gl_FragColor = vec4(pow(max(col, vec3(0.0)), vec3(0.88)), 1.0);
}
`;

export const VERTEX_SHADER_WEBGL2 = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;
