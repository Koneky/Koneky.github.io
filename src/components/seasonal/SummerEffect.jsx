import {
  summerFireflies,
} from './summerFireflies'

const layers = [
  'far',
  'mid',
  'near',
]

function SummerEffect() {
  return (
    <>
      {layers.map((depth) => (
        <div
          key={depth}
          className={
            `seasonal-layer seasonal-layer--${depth}`
          }
        >
          {summerFireflies
            .filter(
              (firefly) =>
                firefly.depth === depth,
            )
            .map((firefly) => (
              <span
                key={firefly.id}
                className={[
                  'summer-firefly',
                  !firefly.mobile
                    ? 'summer-firefly--mobile-hidden'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{
                  '--firefly-left':
                    `${firefly.left}%`,

                  '--firefly-top':
                    `${firefly.top}%`,

                  '--firefly-size':
                    `${firefly.size}px`,

                  '--firefly-glow':
                    `${firefly.glow}px`,

                  '--firefly-opacity':
                    firefly.opacity,

                  '--firefly-duration':
                    `${firefly.duration}s`,

                  '--firefly-delay':
                    `${firefly.delay}s`,

                  '--firefly-pulse-duration':
                    `${firefly.pulseDuration}s`,

                  '--firefly-pulse-delay':
                    `${firefly.pulseDelay}s`,

                  '--firefly-x1':
                    `${firefly.x1}px`,

                  '--firefly-y1':
                    `${firefly.y1}px`,

                  '--firefly-x2':
                    `${firefly.x2}px`,

                  '--firefly-y2':
                    `${firefly.y2}px`,

                  '--firefly-tone':
                    firefly.tone,
                }}
              >
                <span className="summer-firefly__glow" />
              </span>
            ))}
        </div>
      ))}
    </>
  )
}

export default SummerEffect
