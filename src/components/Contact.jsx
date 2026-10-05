import { useEffect, useRef, useState } from 'react'

import { useLanguage } from '../context/useLanguage'
import { getSocialLinksFor } from '../data/socialLinks'
import { copyText } from '../utils/clipboard'

function Contact() {
  const { t } = useLanguage()

  const [copiedLinkId, setCopiedLinkId] = useState(null)
  const feedbackTimerRef = useRef(null)

  const contactLinks = getSocialLinksFor('contact')

  function getLinkLabel(link) {
    return t.contact.links[link.id] ?? link.label
  }

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current)
      }
    }
  }, [])

  async function handleCopyEmail(link) {
    try {
      await copyText(link.value)

      setCopiedLinkId(link.id)

      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current)
      }

      feedbackTimerRef.current = setTimeout(() => {
        setCopiedLinkId(null)
      }, 1800)
    } catch {
      setCopiedLinkId(null)
    }
  }

  return (
    <section className="section contact-section reveal" id="contact">
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
            {contactLinks.map((link) => {
              if (link.kind === 'email') {
                return (
                  <div
                    className="contact-link contact-link--email"
                    key={link.id}
                  >
                    <a
                      href={link.href}
                      className="contact-link__main"
                    >
                      <div>
                        <span className="contact-link__label">
                          {getLinkLabel(link)}
                        </span>

                        <span className="contact-link__value">
                          {link.value}
                        </span>
                      </div>

                      <span className="contact-link__arrow">
                        ↗
                      </span>
                    </a>

                    <button
                      type="button"
                      className="contact-link__copy"
                      onClick={() => handleCopyEmail(link)}
                      aria-label={t.contact.copyEmail}
                    >
                      <span aria-live="polite">
                        {copiedLinkId === link.id
                          ? t.contact.copied
                          : t.contact.copy}
                      </span>
                    </button>
                  </div>
                )
              }

              return (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link"
                  key={link.id}
                >
                  <div>
                    <span className="contact-link__label">
                      {getLinkLabel(link)}
                    </span>

                    <span className="contact-link__value">
                      {link.value}
                    </span>
                  </div>

                  <span className="contact-link__arrow">
                    ↗
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
