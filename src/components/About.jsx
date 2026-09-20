import { useLanguage } from '../context/useLanguage'

function About() {
  const { t } = useLanguage()

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="section__heading">
          <span className="section__label">01</span>
          <h2 className="section__title">{t.about.title}</h2>
        </div>

        <div className="about">
          <div className="about__intro">
            <p className="about__lead">
              {t.about.lead}
            </p>
          </div>

          <div className="about__content">
            <p>{t.about.textOne}</p>
            <p>{t.about.textTwo}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
