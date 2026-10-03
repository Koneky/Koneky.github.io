const depths = ["far", "mid", "near"];

const tones = [
  "#f6a53a",
  "#d9772a",
  "#b94c3d",
  "#8f3d53",
  "#c86f2b",
  "#7d4a7f",
];

const positions = [
  6, 18, 31, 45, 58, 72, 86, 12, 25, 39, 52, 66, 79, 92, 15, 35, 62, 83,
];

function getDepthSettings(depth) {
  if (depth === "far") {
    return {
      size: 10,
      duration: 18,
      opacity: 0.32,
    };
  }

  if (depth === "mid") {
    return {
      size: 14,
      duration: 15,
      opacity: 0.52,
    };
  }

  return {
    size: 18,
    duration: 12,
    opacity: 0.72,
  };
}

export const autumnLeaves = Array.from(
  {
    length: 18,
  },
  (_, index) => {
    const depth = depths[index % depths.length];

    const settings = getDepthSettings(depth);

    return {
      id: index + 1,

      depth,

      mobile: index < 10,

      left: positions[index],

      size: settings.size + (index % 3),

      duration: settings.duration + (index % 4),

      delay: -((index * 1.9) % 14),

      drift: ((index * 31) % 140) - 70,

      rotation: (index * 53) % 360,

      sway: 18 + (index % 5) * 6,

      opacity: settings.opacity,

      tone: tones[index % tones.length],
    };
  },
);
