import { useLanguage } from '../context/useLanguage'

function Hero() {
  const { t } = useLanguage()

  return (
    <section className="hero">
      <div className="hero__glow hero__glow--one" />
      <div className="hero__glow hero__glow--two" />

      <div className="container hero__content">
        <p className="hero__eyebrow">
          {t.hero.role}
        </p>

        <h1 className="hero__title">
          {t.hero.titleStart}{' '}
          <span>{t.hero.titleName}</span>
        </h1>

        <p className="hero__description">
          {t.hero.description}
        </p>

        <div className="hero__actions">
          <a
            href="#projects"
            className="button button--primary"
          >
            {t.hero.projectsButton}
          </a>

          <a
            href="https://github.com/Koneky"
            target="_blank"
            rel="noreferrer"
            className="button button--secondary"
          >
            {t.hero.githubButton}
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
