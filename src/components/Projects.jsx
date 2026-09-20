import { useLanguage } from '../context/useLanguage'

import {
  featuredProjects,
  commercialProjects,
  openSourceProjects,
} from '../data/projects'

function ProjectStack({ stack }) {
  return (
    <div className="project-stack">
      {stack.map((technology) => (
        <span
          className="project-stack__item"
          key={technology}
        >
          {technology}
        </span>
      ))}
    </div>
  )
}

function Projects() {
  const { t } = useLanguage()

  const featured = featuredProjects[0]

  return (
    <section
      className="section projects-section"
      id="projects"
    >
      <div className="container">
        <div className="section__heading">
          <span className="section__label">03</span>

          <div>
            <h2 className="section__title">
              {t.projects.title}
            </h2>

            <p className="section__subtitle">
              {t.projects.subtitle}
            </p>
          </div>
        </div>

        {/* Featured */}

        <article className="featured-project">
          <div className="featured-project__glow" />

          <div className="featured-project__top">
            <span className="project-type">
              {t.projects.featuredLabel}
            </span>

            <span className="project-number">
              01
            </span>
          </div>

          <div className="featured-project__content">
            <div>
              <h3 className="featured-project__title">
                {featured.title}
              </h3>

              <p className="featured-project__description">
                {t.projects.items[featured.id].description}
              </p>
            </div>

            <div className="featured-project__footer">
              <ProjectStack stack={featured.stack} />

              <span className="project-private">
                {t.projects.privateRepository}
              </span>
            </div>
          </div>
        </article>

        {/* Commercial */}

        <div className="projects-group">
          <div className="projects-group__heading">
            <h3>{t.projects.commercialTitle}</h3>

            <p>
              {t.projects.commercialDescription}
            </p>
          </div>

          <div className="commercial-grid">
            {commercialProjects.map((project, index) => (
              <article
                className="project-card"
                key={project.id}
              >
                <div className="project-card__top">
                  <span className="project-number">
                    {String(index + 2).padStart(2, '0')}
                  </span>

                  <span className="project-type">
                    Commercial
                  </span>
                </div>

                <h4 className="project-card__title">
                  {project.title}
                </h4>

                <p className="project-card__description">
                  {t.projects.items[project.id].description}
                </p>

                <div className="project-card__footer">
                  <ProjectStack stack={project.stack} />

                  <span className="project-private">
                    {t.projects.privateRepository}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Open source */}

        <div className="projects-group">
          <div className="projects-group__heading">
            <h3>{t.projects.openSourceTitle}</h3>

            <p>
              {t.projects.openSourceDescription}
            </p>
          </div>

          <div className="opensource-grid">
            {openSourceProjects.map((project) => (
              <article
                className="opensource-card"
                key={project.id}
              >
                <div>
                  <h4 className="opensource-card__title">
                    {project.title}
                  </h4>

                  <p className="opensource-card__description">
                    {t.projects.items[project.id].description}
                  </p>
                </div>

                <div className="opensource-card__bottom">
                  <ProjectStack stack={project.stack} />

                  <a
                    href={project.repository}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    {t.projects.viewGithub}
                    <span>↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects
