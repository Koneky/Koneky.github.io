import { useEffect } from "react";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function normalizePointer(clientX, clientY, width, height) {
  if (width <= 0 || height <= 0) {
    return {
      x: 0,
      y: 0,
    };
  }

  const x = (clientX / width) * 2 - 1;

  const y = (clientY / height) * 2 - 1;

  return {
    x: clamp(x, -1, 1),
    y: clamp(y, -1, 1),
  };
}

export function calculateParallaxOffsets(scrollY, pointerX, pointerY) {
  const scrollWave = Math.sin(scrollY / 500);

  return {
    far: {
      x: pointerX * 4,
      y: pointerY * 3 + scrollWave * 6,
    },

    mid: {
      x: pointerX * 8,
      y: pointerY * 6 + scrollWave * 12,
    },

    near: {
      x: pointerX * 12,
      y: pointerY * 9 + scrollWave * 18,
    },
  };
}

function writeOffsets(root, offsets) {
  root.style.setProperty("--parallax-far-x", `${offsets.far.x}px`);

  root.style.setProperty("--parallax-far-y", `${offsets.far.y}px`);

  root.style.setProperty("--parallax-mid-x", `${offsets.mid.x}px`);

  root.style.setProperty("--parallax-mid-y", `${offsets.mid.y}px`);

  root.style.setProperty("--parallax-near-x", `${offsets.near.x}px`);

  root.style.setProperty("--parallax-near-y", `${offsets.near.y}px`);
}

function writeZeroOffsets(root) {
  writeOffsets(root, {
    far: {
      x: 0,
      y: 0,
    },

    mid: {
      x: 0,
      y: 0,
    },

    near: {
      x: 0,
      y: 0,
    },
  });
}

export function useParallax() {
  useEffect(() => {
    const root = document.documentElement;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const finePointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );

    let frameId = null;

    let pointerX = 0;
    let pointerY = 0;

    const update = () => {
      frameId = null;

      if (reducedMotionQuery.matches) {
        writeZeroOffsets(root);
        return;
      }

      const offsets = calculateParallaxOffsets(
        window.scrollY,
        pointerX,
        pointerY,
      );

      writeOffsets(root, offsets);
    };

    const scheduleUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(update);
    };

    const handleScroll = () => {
      scheduleUpdate();
    };

    const handlePointerMove = (event) => {
      if (reducedMotionQuery.matches || !finePointerQuery.matches) {
        return;
      }

      const normalized = normalizePointer(
        event.clientX,
        event.clientY,
        window.innerWidth,
        window.innerHeight,
      );

      pointerX = normalized.x;
      pointerY = normalized.y;

      scheduleUpdate();
    };

    const handleReducedMotionChange = () => {
      pointerX = 0;
      pointerY = 0;

      if (reducedMotionQuery.matches) {
        if (frameId !== null) {
          window.cancelAnimationFrame(frameId);

          frameId = null;
        }

        writeZeroOffsets(root);
        return;
      }

      scheduleUpdate();
    };

    const handlePointerCapabilityChange = () => {
      if (!finePointerQuery.matches) {
        pointerX = 0;
        pointerY = 0;
      }

      scheduleUpdate();
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    finePointerQuery.addEventListener("change", handlePointerCapabilityChange);

    if (reducedMotionQuery.matches) {
      writeZeroOffsets(root);
    } else {
      scheduleUpdate();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);

      window.removeEventListener("pointermove", handlePointerMove);

      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotionChange,
      );

      finePointerQuery.removeEventListener(
        "change",
        handlePointerCapabilityChange,
      );

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);
}
