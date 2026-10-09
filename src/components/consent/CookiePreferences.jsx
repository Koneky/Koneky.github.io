import { useEffect, useState } from 'react'

import { useLanguage } from '../../context/useLanguage'
import { useConsent } from '../../context/useConsent'

function CookiePreferencesDialog({
  consent,
  saveConsent,
  closePreferences,
}) {
  const { t } = useLanguage()

  const [analytics, setAnalytics] = useState(
    consent?.analytics ?? false,
  )

  const [behaviorAnalytics, setBehaviorAnalytics] = useState(
    consent?.behaviorAnalytics ?? false,
  )

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closePreferences()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closePreferences])

  function handleAnalyticsChange(event) {
    const enabled = event.target.checked

    setAnalytics(enabled)

    if (!enabled) {
      setBehaviorAnalytics(false)
    }
  }

  function handleSave() {
    saveConsent({
      version: 1,
      analytics,
      behaviorAnalytics,
    })

    closePreferences()
  }

  return (
    <div
      className="cookie-preferences"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closePreferences()
        }
      }}
    >
      <section
        className="cookie-preferences__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
      >
        <div className="cookie-preferences__header">
          <div>
            <p className="cookie-preferences__eyebrow">
              {t.consent.preferencesEyebrow}
            </p>

            <h2
              id="cookie-preferences-title"
              className="cookie-preferences__title"
            >
              {t.consent.preferencesTitle}
            </h2>
          </div>

          <button
            type="button"
            className="cookie-preferences__close"
            onClick={closePreferences}
            aria-label={t.consent.close}
          >
            ×
          </button>
        </div>

        <p className="cookie-preferences__description">
          {t.consent.preferencesDescription}
        </p>

        <div className="cookie-preferences__options">
          <div className="cookie-preferences__option">
            <div>
              <h3>{t.consent.necessaryTitle}</h3>
              <p>{t.consent.necessaryDescription}</p>
            </div>

            <input
              type="checkbox"
              checked
              disabled
              aria-label={t.consent.necessaryTitle}
            />
          </div>

          <label className="cookie-preferences__option">
            <div>
              <h3>{t.consent.analyticsTitle}</h3>
              <p>{t.consent.analyticsDescription}</p>
            </div>

            <input
              type="checkbox"
              checked={analytics}
              onChange={handleAnalyticsChange}
            />
          </label>

          <label
            className={`cookie-preferences__option ${
              !analytics
                ? 'cookie-preferences__option--disabled'
                : ''
            }`}
          >
            <div>
              <h3>{t.consent.behaviorTitle}</h3>
              <p>{t.consent.behaviorDescription}</p>
            </div>

            <input
              type="checkbox"
              checked={behaviorAnalytics}
              disabled={!analytics}
              onChange={(event) => {
                setBehaviorAnalytics(event.target.checked)
              }}
            />
          </label>
        </div>

        <div className="cookie-preferences__footer">
          <button
            type="button"
            className="cookie-banner__button"
            onClick={closePreferences}
          >
            {t.consent.cancel}
          </button>

          <button
            type="button"
            className="cookie-banner__button"
            onClick={handleSave}
          >
            {t.consent.save}
          </button>
        </div>
      </section>
    </div>
  )
}

export default function CookiePreferences() {
  const {
    consent,
    preferencesOpen,
    saveConsent,
    closePreferences,
  } = useConsent()

  if (!preferencesOpen) {
    return null
  }

  return (
    <CookiePreferencesDialog
      consent={consent}
      saveConsent={saveConsent}
      closePreferences={closePreferences}
    />
  )
}
