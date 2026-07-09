export type ShaderQualityTier = "high" | "medium" | "low" | "ultra-low";

export type ShaderQualityConfig = {
  tier: ShaderQualityTier;
  marchSteps: number;
  innerSteps: number;
  fpsCap: number;
  dprCap: number;
  qualityScale: number;
  minQualityScale: number;
};

export function detectShaderQuality(): ShaderQualityConfig {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const pixels = w * h;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;

  // Smaller screens have fewer fragments — can afford higher shader fidelity.
  if (isCoarse || pixels < 520_000) {
    return {
      tier: "high",
      marchSteps: 12,
      innerSteps: 6,
      fpsCap: 30,
      dprCap: 1.15,
      qualityScale: 1,
      minQualityScale: 0.85,
    };
  }

  if (pixels < 1_400_000) {
    return {
      tier: "medium",
      marchSteps: 10,
      innerSteps: 5,
      fpsCap: 24,
      dprCap: 1,
      qualityScale: 0.85,
      minQualityScale: 0.7,
    };
  }

  if (pixels < 2_400_000) {
    return {
      tier: "low",
      marchSteps: 8,
      innerSteps: 4,
      fpsCap: 24,
      dprCap: 0.95,
      qualityScale: 0.72,
      minQualityScale: 0.58,
    };
  }

  return {
    tier: "ultra-low",
    marchSteps: 6,
    innerSteps: 3,
    fpsCap: 20,
    dprCap: 0.85,
    qualityScale: 0.62,
    minQualityScale: 0.5,
  };
}

export function adaptQualityScale(
  config: ShaderQualityConfig,
  currentScale: number,
  frameMs: number,
  targetMs: number,
): { scale: number; marchSteps: number; innerSteps: number; fpsCap: number } {
  let scale = currentScale;
  let { marchSteps, innerSteps, fpsCap } = config;

  if (frameMs > targetMs * 1.35) {
    scale = Math.max(config.minQualityScale, scale - 0.06);
    if (frameMs > targetMs * 1.8 && marchSteps > 6) marchSteps -= 1;
    if (frameMs > targetMs * 2.2 && innerSteps > 3) innerSteps -= 1;
    if (frameMs > targetMs * 2.6 && fpsCap > 18) fpsCap -= 2;
  } else if (frameMs < targetMs * 0.72 && scale < config.qualityScale) {
    scale = Math.min(config.qualityScale, scale + 0.03);
  }

  return { scale, marchSteps, innerSteps, fpsCap };
}
