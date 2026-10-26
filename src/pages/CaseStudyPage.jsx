
import { useParams } from "react-router-dom";

import { useLanguage } from "../context/useLanguage.js";
import {
  getCaseStudyBySlug,
} from "../data/caseStudies/index.js";

import CaseStudyHero from "../components/case-study/CaseStudyHero.jsx";
import CaseStudySection from "../components/case-study/CaseStudySection.jsx";
import NotFoundPage from "./NotFoundPage.jsx";

import "./caseStudy.css";

const narrativeSections = [
  { key: "role" },
  { key: "challenge" },
  { key: "solution" },
  { key: "architecture", callout: true },
];

function getLocalizedText(value, language) {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  return typeof value[language] === "string"
    ? value[language]
    : "";
}

export default function CaseStudyPage() {
  const { slug } = useParams();
  const { language, t } = useLanguage();

  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return <NotFoundPage />;
  }

  const labels = t.caseStudy;

  const gallery = Array.isArray(study.gallery)
    ? study.gallery
    : [];

  const links = Array.isArray(study.links)
    ? study.links
    : [];

  const hasNarrative = narrativeSections.some(
    ({ key }) =>
      getLocalizedText(study[key], language).trim(),
  );

  const hasResults = Boolean(
    getLocalizedText(study.results, language).trim(),
  );

  const hasBody =
    hasNarrative ||
    hasResults ||
    gallery.length > 0 ||
    links.length > 0;

  return (
    <main className="case-study-page">
      <div className="case-study-page__inner">
        <CaseStudyHero
          study={study}
          language={language}
          labels={labels}
        />

        {hasBody && (
          <div className="case-study-page__body">
            {narrativeSections.map(
              ({ key, callout }) => (
                <CaseStudySection
                  key={key}
                  title={labels.sections[key]}
                  content={getLocalizedText(
                    study[key],
                    language,
                  )}
                  callout={callout}
                />
              ),
            )}

            {gallery.length > 0 && (
              <CaseStudySection
                title={labels.sections.gallery}
              >
                <div className="case-study-gallery">
                  {gallery.map((image) => (
                    <figure
                      className="case-study-gallery__item"
                      key={image.src}
                    >
                      <img
                        className="case-study-gallery__image"
                        src={image.src}
                        alt={getLocalizedText(
                          image.alt,
                          language,
                        )}
                        loading="lazy"
                      />
                    </figure>
                  ))}
                </div>
              </CaseStudySection>
            )}

            <CaseStudySection
              title={labels.sections.results}
              content={getLocalizedText(
                study.results,
                language,
              )}
            />

            {links.length > 0 && (
              <CaseStudySection
                title={labels.sections.links}
              >
                <div className="case-study-links">
                  {links.map((link) => (
                    <a
                      className="case-study-links__item"
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {getLocalizedText(
                        link.label,
                        language,
                      )}
                      <span aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              </CaseStudySection>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
