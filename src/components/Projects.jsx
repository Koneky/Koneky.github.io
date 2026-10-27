
import { Link, useLocation } from "react-router-dom";

import { useLanguage } from "../context/useLanguage";

import { projects } from "../data/projects.js";
import { getTechnology } from "../data/technologies.js";
import { routePaths } from "../router/routeConfig.js";

import {
  getTechnologyFilter,
  filterProjectsByTechnology,
  clearTechnologyFilter,
} from "../utils/projectFilters.js";

function ProjectStack({ technologies }) {
  return (
    <div className="project-stack">
      {technologies.map((technologyId) => {
        const technology = getTechnology(technologyId);

        return (
          <span
            className="project-stack__item"
            key={technologyId}
          >
            {technology?.label ?? technologyId}
          </span>
        );
      })}
    </div>
  );
}

function ProjectCaseStudyLink({ project, label }) {
  if (!project.caseStudySlug) {
    return null;
  }

  return (
    <Link
      to={routePaths.project(project.caseStudySlug)}
      className="project-link"
    >
      {label}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}

function Projects() {
  const { t } = useLanguage();
  const location = useLocation();

  const technologyId = getTechnologyFilter(
    location.search,
  );

  const hasActiveFilter = technologyId !== null;

  const visibleProjects = filterProjectsByTechnology(
    projects,
    technologyId,
  );

  const technologyLabel = hasActiveFilter
    ? getTechnology(technologyId)?.label ?? technologyId
    : null;

  const featured = visibleProjects.find(
    (project) => project.type === "featured",
  );

  const commercialProjects = visibleProjects.filter(
    (project) => project.type === "commercial",
  );

  const openSourceProjects = visibleProjects.filter(
    (project) => project.type === "open-source",
  );

  const clearFilterTarget = {
    pathname: location.pathname,
    search: clearTechnologyFilter(location.search),
    hash: "#projects",
  };

  return (
    <section
      className="section projects-section reveal"
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

        {/* Active technology filter */}

        {hasActiveFilter && (
          <div className="projects-filter">
            <div className="projects-filter__chip">
              <span>
                {t.projects.filteredBy}:{" "}
                <strong>{technologyLabel}</strong>
              </span>

              <Link
                to={clearFilterTarget}
                className="projects-filter__clear"
                aria-label={`${t.projects.clearFilter}: ${technologyLabel}`}
              >
                <span aria-hidden="true">×</span>
                {t.projects.clearFilter}
              </Link>
            </div>

            <p
              className="projects-filter__count"
              role="status"
            >
              {t.projects.resultsCount}:{" "}
              {visibleProjects.length}
            </p>
          </div>
        )}

        {/* No matching projects */}

        {hasActiveFilter &&
          visibleProjects.length === 0 && (
            <p
              className="projects-filter__empty"
              role="status"
            >
              {t.projects.noResults}
            </p>
          )}

        {/* Featured */}

        {featured && (
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
                  {
                    t.projects.items[featured.id]
                      .description
                  }
                </p>
              </div>
              <div className="featured-project__footer">
                <ProjectStack
                  technologies={featured.technologies}
                />

                <div className="featured-project__actions">
                  <span className="project-private">
                    {t.projects.privateRepository}
                  </span>

                  <ProjectCaseStudyLink
                    project={featured}
                    label={t.caseStudy.cta}
                  />
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Commercial */}

        {commercialProjects.length > 0 && (
          <div
            className={
              featured
                ? "projects-group"
                : "projects-group projects-group--first"
            }
          >
            <div className="projects-group__heading">
              <h3>{t.projects.commercialTitle}</h3>

              <p>
                {t.projects.commercialDescription}
              </p>
            </div>

            <div className="commercial-grid">
              {commercialProjects.map(
                (project, index) => (
                  <article
                    className="project-card"
                    key={project.id}
                  >
                    <div className="project-card__top">
                      <span className="project-number">
                        {String(
                          index + (featured ? 2 : 1),
                        ).padStart(2, "0")}
                      </span>

                      <span className="project-type">
                        Commercial
                      </span>
                    </div>

                    <h4 className="project-card__title">
                      {project.title}
                    </h4>

                    <p className="project-card__description">
                      {
                        t.projects.items[project.id]
                          .description
                      }
                    </p>

                    <div className="project-card__footer">
                      <ProjectStack
                        technologies={
                          project.technologies
                        }
                      />

                      <span className="project-private">
                        {t.projects.privateRepository}
                      </span>
                    </div>
                  </article>
                ),
              )}
            </div>
          </div>
        )}

        {/* Open source */}

        {openSourceProjects.length > 0 && (
          <div
            className={
              featured || commercialProjects.length > 0
                ? "projects-group"
                : "projects-group projects-group--first"
            }
          >
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
                      {
                        t.projects.items[project.id]
                          .description
                      }
                    </p>
                  </div>

                  <div className="opensource-card__bottom">
                    <ProjectStack
                      technologies={project.technologies}
                    />

                    <a
                      href={project.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      {t.projects.viewGithub}
                      <span>↗</span>
                    </a>
                    <ProjectCaseStudyLink
                      project={project}
                      label={t.caseStudy.cta}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;
