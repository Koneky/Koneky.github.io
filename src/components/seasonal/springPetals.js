const depths = ["far", "mid", "near"];

const tones = ["#ff7fbd", "#e58cff", "#b99cff"];

function getDepthSettings(depth) {
  if (depth === "far") {
    return {
      size: 8,
      duration: 16,
      opacity: 0.4,
    };
  }

  if (depth === "mid") {
    return {
      size: 11,
      duration: 13,
      opacity: 0.62,
    };
  }

  return {
    size: 15,
    duration: 10,
    opacity: 0.82,
  };
}

export const springPetals = Array.from(
  {
    length: 21,
  },
  (_, index) => {
    const depth = depths[index % depths.length];

    const settings = getDepthSettings(depth);

    return {
      id: index + 1,

      depth,

      left: (index * 37 + 11) % 100,

      size: settings.size + (index % 3),

      duration: settings.duration + (index % 4),

      delay: -((index * 1.7) % 12),

      drift: ((index * 23) % 120) - 60,

      rotation: (index * 47) % 360,

      opacity: settings.opacity,

      tone: tones[index % tones.length],
    };
  },
);
