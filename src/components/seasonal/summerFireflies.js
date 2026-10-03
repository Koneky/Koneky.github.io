const depths = ["far", "mid", "near"];

const tones = [
  "#ffd76a",
  "#ffe799",
  "#ffc95c",
  "#fff0ad",
  "#ffd16f",
  "#79e7ff",
  "#c5a6ff",
];

function getDepthSettings(depth) {
  if (depth === "far") {
    return {
      size: 2,
      duration: 25,
      opacity: 0.38,
      glow: 10,
    };
  }

  if (depth === "mid") {
    return {
      size: 3,
      duration: 20,
      opacity: 0.58,
      glow: 14,
    };
  }

  return {
    size: 4,
    duration: 16,
    opacity: 0.78,
    glow: 18,
  };
}

const positions = [
  { left: 8, top: 14 },
  { left: 50, top: 10 },
  { left: 88, top: 16 },

  { left: 18, top: 47 },
  { left: 55, top: 43 },
  { left: 89, top: 50 },

  { left: 10, top: 82 },
  { left: 48, top: 88 },
  { left: 82, top: 80 },

  { left: 29, top: 25 },
  { left: 70, top: 28 },
  { left: 34, top: 66 },
  { left: 69, top: 63 },
  { left: 30, top: 92 },
  { left: 68, top: 94 },
];

export const summerFireflies = Array.from(
  {
    length: 15,
  },
  (_, index) => {
    const depth = depths[index % depths.length];

    const settings = getDepthSettings(depth);

    return {
      id: index + 1,

      depth,

      mobile: index < 9,

      left: positions[index].left,

      top: positions[index].top,

      size: settings.size + (index % 2),

      glow: settings.glow + (index % 3) * 2,

      opacity: settings.opacity,

      duration: settings.duration + (index % 5),

      delay: -((index * 2.7) % 18),

      pulseDuration: 2.4 + (index % 5) * 0.45,

      pulseDelay: -((index * 0.8) % 4),

      x1: ((index * 29) % 90) - 45,

      y1: ((index * 17) % 70) - 35,

      x2: ((index * 43) % 120) - 60,

      y2: ((index * 31) % 90) - 45,

      tone: tones[index % tones.length],
    };
  },
);
