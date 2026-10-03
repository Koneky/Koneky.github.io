import { getSeason } from '../../utils/getSeason';
import { useParallax } from '../../hooks/useParallax';

import SpringEffect from './SpringEffect';
import SummerEffect from './SummerEffect';
import AutumnEffect from './AutumnEffect';
import WinterEffect from './WinterEffect';

import './seasonal.css';

const effects = {
  spring: SpringEffect,
  summer: SummerEffect,
  autumn: AutumnEffect,
  winter: WinterEffect,
}

function SeasonalBackground() {
  useParallax();

  const season = getSeason(
    window.location.search,
    new Date(),
  );

  const Effect = effects[season];

  return (
    <div
      className="seasonal-background"
      data-season={season}
      aria-hidden="true"
    >
      <Effect />
    </div>
  );
}

export default SeasonalBackground;
