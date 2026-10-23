
import { Link, useLocation } from "react-router-dom";

import { trackEvent } from "../analytics/analytics.js";
import { useLanguage } from "../context/useLanguage";

import {
  technologyGroups,
  getTechnology,
} from "../data/technologies.js";

import { projects } from "../data/projects.js";
import { routePaths } from "../router/routeConfig.js";

import {
  hasProjectsForTechnology,
} from "../utils/projectFilters.js";

function TechStack() {
  const { t } = useLanguage();
  const location = useLocation();

  function handleTechnologySelect(technologyId) {
    if (!hasProjectsForTechnology(projects, technologyId)) {
      return;
    }

    trackEvent("technology_filter", {
      technology_id: technologyId,
    });
  }

  function getTechnologyTarget(technologyId) {
    const params = new URLSearchParams(location.search);

    // Preserve unrelated query parameters.
    params.set("tech", technologyId);

    return {
      pathname: routePaths.home,
      search: `?${params.toString()}`,
      hash: "#projects",
    };
  }

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
                  const technology = getTechnology(technologyId);
                  const label = technology?.label ?? technologyId;

                  const hasProjects = hasProjectsForTechnology(
                    projects,
                    technologyId,
                  );

                  if (!hasProjects) {
                    return (
                      <span
                        className="stack-card__item"
                        key={technologyId}
                      >
                        {label}
                      </span>
                    );
                  }

                  return (
                    <Link
                      key={technologyId}
                      className="stack-card__item stack-card__item--interactive"
                      to={getTechnologyTarget(technologyId)}
                      aria-label={`${t.projects.title}: ${label}`}
                      onClick={() => {
                        handleTechnologySelect(technologyId);
                      }}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TechStack;
