import { useLanguage } from '../context/useLanguage'

function Contact() {
  const { t } = useLanguage()

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <div className="section__heading">
          <span className="section__label">04</span>

          <h2 className="section__title">
            {t.contact.title}
          </h2>
        </div>

        <div className="contact">
          <div className="contact__content">
            <p className="contact__eyebrow">
              {t.contact.eyebrow}
            </p>

            <h3 className="contact__title">
              {t.contact.heading}
            </h3>

            <p className="contact__description">
              {t.contact.description}
            </p>
          </div>

          <div className="contact__links">
            <a
              href="https://github.com/Koneky"
              target="_blank"
              rel="noreferrer"
              className="contact-link"
            >
              <div>
                <span className="contact-link__label">
                  GitHub
                </span>

                <span className="contact-link__value">
                  @Koneky
                </span>
              </div>

              <span className="contact-link__arrow">
                ↗
              </span>
            </a>

            {/* Позже сюда добавим Telegram / Email */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
