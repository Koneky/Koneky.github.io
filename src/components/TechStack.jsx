import { useLanguage } from '../context/useLanguage'

const stackGroups = [
  {
    key: 'backend',
    technologies: [
      'Python',
      'Django',
      'Django REST Framework',
      'FastAPI',
    ],
  },
  {
    key: 'frontend',
    technologies: [
      'React',
      'JavaScript',
      'HTML',
      'CSS',
      'Vite',
    ],
  },
  {
    key: 'mobile',
    technologies: [
      'Flutter',
      'Dart',
    ],
  },
  {
    key: 'tools',
    technologies: [
      'Git',
      'GitHub',
      'Docker',
      'PostgreSQL',
      'Linux',
    ],
  },
]

function TechStack() {
  const { t } = useLanguage()

  return (
    <section className="section" id="stack">
      <div className="container">
        <div className="section__heading">
          <span className="section__label">02</span>
          <h2 className="section__title">
            {t.stack.title}
          </h2>
        </div>

        <div className="stack-grid">
          {stackGroups.map((group) => (
            <article
              className="stack-card"
              key={group.key}
            >
              <p className="stack-card__title">
                {t.stack.groups[group.key]}
              </p>

              <div className="stack-card__items">
                {group.technologies.map((technology) => (
                  <span
                    className="stack-card__item"
                    key={technology}
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechStack
