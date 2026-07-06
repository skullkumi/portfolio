export const site = {
  name: "kumi",
  tagline: "音と光の空間設計。クリエイター",
  description:
    "VRMV・Unity Shader・パーティクルで、音と光が交差する空間を設計するクリエイター。",
  locale: "ja" as const,
};

export const services = [
  {
    id: "vrmv",
    title: "VRMV 制作",
    command: "kumi render --mode vrmv",
    description:
      "VR空間向けの映像・ビジュアルを設計。イベントやワールドに合わせた空間演出を制作します。",
    tags: ["VRChat", "映像演出", "空間設計"],
  },
  {
    id: "shader",
    title: "Unity Shader 制作",
    command: "kumi compile --pipeline builtin",
    description:
      "Built-in Render Pipeline を中心としたカスタムシェーダー。光の挙動や質感表現をコントロールします。",
    tags: ["Unity", "Built-in RP", "HLSL/CG"],
  },
  {
    id: "particle",
    title: "Unity パーティクル",
    command: "kumi emit --system particle",
    description:
      "パーティクルシステムによる動的な光・塵・エフェクト。シーンの空気感をつくります。",
    tags: ["Particle System", "VFX", "リアルタイム"],
  },
];

export type ShaderItem = {
  id: string;
  title: string;
  description: string;
  type: "live" | "video";
  videoSrc?: string;
  posterSrc?: string;
  tags: string[];
};

export const shaders: ShaderItem[] = [
  {
    id: "shader-02",
    title: "Shader Study 02",
    description: "Unity Built-in 向けシェーダー研究。録画プレビュー用プレースホルダー。",
    type: "video",
    videoSrc: "/assets/shaders/shader-02.mp4",
    posterSrc: "/assets/shaders/shader-02-poster.jpg",
    tags: ["Unity", "Built-in RP"],
  },
  {
    id: "shader-03",
    title: "Shader Study 03",
    description: "パーティクルとシェーダーの組み合わせ検証。録画プレビュー用プレースホルダー。",
    type: "video",
    videoSrc: "/assets/shaders/shader-03.mp4",
    posterSrc: "/assets/shaders/shader-03-poster.jpg",
    tags: ["Particle", "Glow"],
  },
];

export type WorkItem = {
  id: string;
  title: string;
  description: string;
  videoSrc?: string;
  posterSrc?: string;
  tags: string[];
  year: string;
  linkUrl?: string;
  linkLabel?: string;
};

export const works: WorkItem[] = [
  {
    id: "kumi-testing-world",
    title: "KumiTestingWorld",
    description:
      "Animation を1つ入れて動作確認しているテスト用ワールド。VR空間演出の実験・検証用に制作。",
    videoSrc: "/assets/works/kumi-testing-world.mp4",
    posterSrc: "/assets/works/kumi-testing-world-poster.jpg",
    linkUrl:
      "https://vrchat.com/home/world/wrld_9e9fbc9c-67f8-46ae-8515-dcfe99dec84b/info",
    linkLabel: "VRChat で見る",
    tags: ["VRChat", "VRMV", "Shader", "World"],
    year: "2026",
  },
];

export const contact = {
  x: "https://x.com/UmU_rythm",
  xHandle: "@UmU_rythm",
  discord: "kumiiiiiv",
};
