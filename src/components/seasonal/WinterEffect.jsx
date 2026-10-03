import {
  winterSnow,
} from './winterSnow'

const layers = [
  'far',
  'mid',
  'near',
]

function WinterEffect() {
  return (
    <>
      {layers.map((depth) => (
        <div
          key={depth}
          className={
            `seasonal-layer seasonal-layer--${depth}`
          }
        >
          {winterSnow
            .filter(
              (snowflake) =>
                snowflake.depth === depth,
            )
            .map((snowflake) => (
              <span
                key={snowflake.id}
                className={[
                  'winter-snowflake',
                  `winter-snowflake--${snowflake.shape}`,
                  !snowflake.mobile
                    ? 'winter-snowflake--mobile-hidden'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{
                  '--snow-left':
                    `${snowflake.left}%`,

                  '--snow-size':
                    `${snowflake.size}px`,

                  '--snow-duration':
                    `${snowflake.duration}s`,

                  '--snow-delay':
                    `${snowflake.delay}s`,

                  '--snow-drift':
                    `${snowflake.drift}px`,

                  '--snow-sway':
                    `${snowflake.sway}px`,

                  '--snow-opacity':
                    snowflake.opacity,

                  '--snow-blur':
                    `${snowflake.blur}px`,

                  '--snow-tone':
                    snowflake.tone,
                }}
              >
                {snowflake.shape !== 'dot' && (
                  <span className="winter-snowflake__crystal">
                    <span className="winter-snowflake__arm winter-snowflake__arm--1" />
                    <span className="winter-snowflake__arm winter-snowflake__arm--2" />
                    <span className="winter-snowflake__arm winter-snowflake__arm--3" />
                  </span>
                )}
              </span>
            ))}
        </div>
      ))}
    </>
  )
}

export default WinterEffect
