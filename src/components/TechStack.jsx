import { useLanguage } from '../context/useLanguage'
import {
  technologyGroups,
  getTechnology,
} from '../data/technologies'

function TechStack() {
  const { t } = useLanguage()

  return (
    <section className="section reveal" id="stack">
      <div className="container">
        <div className="section__heading">
          <span className="section__label">02</span>
          <h2 className="section__title">
            {t.stack.title}
          </h2>
        </div>

        <div className="stack-grid">
          {technologyGroups.map((group) => (
            <article
              className="stack-card"
              key={group.key}
            >
              <p className="stack-card__title">
                {t.stack.groups[group.key]}
              </p>

              <div className="stack-card__items">
                {group.technologies.map((technologyId) => {
                  const technology = getTechnology(technologyId)

                  return (
                    <span
                      className="stack-card__item"
                      key={technologyId}
                    >
                      {technology?.label ?? technologyId}
                    </span>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechStack
