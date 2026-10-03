import {
  springPetals,
} from './springPetals'

const layers = [
  'far',
  'mid',
  'near',
]

function SpringEffect() {
  return (
    <>
      {layers.map((depth) => (
        <div
          key={depth}
          className={
            `seasonal-layer seasonal-layer--${depth}`
          }
        >
          {springPetals
            .filter(
              (petal) =>
                petal.depth === depth,
            )
            .map((petal) => (
              <span
                key={petal.id}
                className="spring-petal"
                style={{
                  '--petal-left':
                    `${petal.left}%`,

                  '--petal-size':
                    `${petal.size}px`,

                  '--petal-duration':
                    `${petal.duration}s`,

                  '--petal-delay':
                    `${petal.delay}s`,

                  '--petal-drift':
                    `${petal.drift}px`,

                  '--petal-rotation':
                    `${petal.rotation}deg`,

                  '--petal-opacity':
                    petal.opacity,

                  '--petal-color':
                    petal.tone,
                }}
              />
            ))}
        </div>
      ))}
    </>
  )
}

export default SpringEffect
