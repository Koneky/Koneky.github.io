import { Link } from "react-router-dom";

import { useLanguage } from "../context/useLanguage";

function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <main>
      <section className="hero">
        <div className="hero__glow hero__glow--one" />
        <div className="hero__glow hero__glow--two" />

        <div className="container hero__content">
          <p className="hero__eyebrow">
            404
          </p>

          <h1 className="hero__title">
            {t.notFound.title}
          </h1>

          <p className="hero__description">
            {t.notFound.description}
          </p>

          <div className="hero__actions">
            <Link
              to="/"
              className="button button--primary"
            >
              {t.notFound.home}
            </Link>

            <Link
              to="/#projects"
              className="button button--secondary"
            >
              {t.notFound.projects}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default NotFoundPage;
