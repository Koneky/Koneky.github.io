const depths = ["far", "mid", "near"];

const tones = ["#ffffff", "#dff7ff", "#e9e2ff"];

const positions = [
  4, 13, 22, 31, 40, 49, 58, 67, 76, 85, 94,

  9, 18, 27, 36, 45, 54, 63, 72, 81, 90,

  6, 16, 25, 34, 43, 52, 61, 70, 79, 88, 96, 48,
];

function getDepthSettings(depth) {
  if (depth === "far") {
    return {
      size: 2,
      duration: 19,
      opacity: 0.3,
      blur: 0.7,
    };
  }

  if (depth === "mid") {
    return {
      size: 6,
      duration: 15,
      opacity: 0.5,
      blur: 0.15,
    };
  }

  return {
    size: 11,
    duration: 11,
    opacity: 0.72,
    blur: 0,
  };
}

export const winterSnow = Array.from(
  {
    length: 33,
  },
  (_, index) => {
    const depth = depths[index % depths.length];

    const settings = getDepthSettings(depth);

    return {
      id: index + 1,

      depth,

      mobile: index < 20,

      left: positions[index],

      size: settings.size + (index % 2),

      duration: settings.duration + (index % 5),

      delay: -((index * 1.35) % 18),

      drift: ((index * 37) % 100) - 50,

      sway: 12 + (index % 5) * 6,

      opacity: settings.opacity,

      blur: settings.blur,

      tone: tones[index % tones.length],

      shape:
        depth === "far"
          ? "dot"
          : depth === "near"
            ? "flake"
            : index % 2 === 0
              ? "crystal"
              : "dot",
    };
  },
);
