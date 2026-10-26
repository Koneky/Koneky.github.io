
import { Link } from "react-router-dom";

import { getTechnology } from "../../data/technologies.js";
import { routePaths } from "../../router/routeConfig.js";

export default function CaseStudyHero({
  study,
  language,
  labels,
}) {
  return (
    <header className="case-study-hero">
      <Link
        className="case-study-hero__back"
        to="/#projects"
      >
        ← {labels.backToProjects}
      </Link>

      <p className="case-study-hero__eyebrow">
        {labels.eyebrow}
      </p>

      <h1 className="case-study-hero__title">
        {study.title[language]}
      </h1>

      <p className="case-study-hero__summary">
        {study.summary[language]}
      </p>

      {study.technologies.length > 0 && (
        <nav
          className="case-study-hero__stack"
          aria-label={labels.stackTitle}
        >
          {study.technologies.map((technologyId) => {
            const technology = getTechnology(technologyId);

            return (
              <Link
                key={technologyId}
                className="case-study-hero__tag"
                to={{
                  pathname: routePaths.home,
                  search: `?tech=${encodeURIComponent(technologyId)}`,
                  hash: "#projects",
                }}
              >
                {technology.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
