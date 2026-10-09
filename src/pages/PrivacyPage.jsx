import { Link } from "react-router-dom";

import { useConsent } from "../context/useConsent";
import { useLanguage } from "../context/useLanguage";
import { routePaths } from "../router/routeConfig";

import "./privacy.css";

export default function PrivacyPage() {
  const { t } = useLanguage();
  const { openPreferences } = useConsent();

  return (
    <main className="privacy-page">
      <div className="container privacy-page__inner">
        <div className="privacy-page__header">
          <p className="privacy-page__eyebrow">
            {t.privacy.eyebrow}
          </p>

          <h1 className="privacy-page__title">
            {t.privacy.title}
          </h1>

          <p className="privacy-page__intro">
            {t.privacy.intro}
          </p>
        </div>

        <div className="privacy-page__content">
          <section className="privacy-page__section">
            <h2>{t.privacy.necessaryTitle}</h2>

            <p>{t.privacy.necessaryDescription}</p>

            <code className="privacy-page__code">
              qarumi-consent-v1
            </code>
          </section>

          <section className="privacy-page__section">
            <h2>{t.privacy.analyticsTitle}</h2>

            <p>{t.privacy.analyticsDescription}</p>
          </section>

          <section>
            <h2>{t.privacy.behaviorTitle}</h2>

            <p>{t.privacy.behaviorDescription}</p>
          </section>

          <section>
            <h2>{t.privacy.controlTitle}</h2>

            <p>{t.privacy.controlDescription}</p>

            <button
              type="button"
              className="privacy-page__button"
              onClick={openPreferences}
            >
              {t.privacy.managePreferences}
            </button>
          </section>
        </div>

        <Link
          className="privacy-page__back"
          to={routePaths.home}
        >
          ← {t.privacy.backHome}
        </Link>
      </div>
    </main>
  );
}
