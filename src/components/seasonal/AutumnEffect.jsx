import {
  autumnLeaves,
} from './autumnLeaves'

const layers = [
  'far',
  'mid',
  'near',
]

function AutumnEffect() {
  return (
    <>
      {layers.map((depth) => (
        <div
          key={depth}
          className={
            `seasonal-layer seasonal-layer--${depth}`
          }
        >
          {autumnLeaves
            .filter(
              (leaf) =>
                leaf.depth === depth,
            )
            .map((leaf) => (
              <span
                key={leaf.id}
                className={[
                  'autumn-leaf',
                  !leaf.mobile
                    ? 'autumn-leaf--mobile-hidden'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{
                  '--leaf-left':
                    `${leaf.left}%`,

                  '--leaf-size':
                    `${leaf.size}px`,

                  '--leaf-duration':
                    `${leaf.duration}s`,

                  '--leaf-delay':
                    `${leaf.delay}s`,

                  '--leaf-drift':
                    `${leaf.drift}px`,

                  '--leaf-rotation':
                    `${leaf.rotation}deg`,

                  '--leaf-sway':
                    `${leaf.sway}px`,

                  '--leaf-opacity':
                    leaf.opacity,

                  '--leaf-tone':
                    leaf.tone,
                }}
              >
                <span className="autumn-leaf__vein" />
              </span>
            ))}
        </div>
      ))}
    </>
  )
}

export default AutumnEffect
