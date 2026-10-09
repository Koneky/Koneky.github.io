import { useLanguage } from '../../context/useLanguage'
import { useConsent } from '../../context/useConsent'

import './consent.css'

export default function CookieBanner() {
  const { t } = useLanguage()
  const {
    hasDecision,
    acceptAll,
    rejectOptional,
    openPreferences,
  } = useConsent()

  if (hasDecision) {
    return null
  }

  return (
    <section
      className="cookie-banner"
      aria-label={t.consent.bannerLabel}
    >
      <div className="cookie-banner__content">
        <div className="cookie-banner__copy">
          <h2 className="cookie-banner__title">
            {t.consent.title}
          </h2>

          <p className="cookie-banner__description">
            {t.consent.description}
          </p>
        </div>

        <div className="cookie-banner__actions">
          <button
            type="button"
            className="cookie-banner__button"
            onClick={acceptAll}
          >
            {t.consent.acceptAll}
          </button>

          <button
            type="button"
            className="cookie-banner__button"
            onClick={rejectOptional}
          >
            {t.consent.rejectOptional}
          </button>

          <button
            type="button"
            className="cookie-banner__button"
            onClick={openPreferences}
          >
            {t.consent.settings}
          </button>
        </div>
      </div>
    </section>
  )
}
