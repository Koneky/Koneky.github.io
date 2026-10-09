import { useState } from 'react'

import { ConsentContext } from './ConsentContext'
import {
  normalizeConsent,
  readConsent,
  writeConsent,
} from '../utils/consent'

function getInitialConsent() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return readConsent(window.localStorage)
  } catch {
    return null
  }
}

export function ConsentProvider({ children }) {
  const [consent, setConsent] = useState(getInitialConsent)
  const [preferencesOpen, setPreferencesOpen] = useState(false)

  function saveConsent(value) {
    const normalizedConsent = normalizeConsent(value)

    try {
      writeConsent(normalizedConsent, window.localStorage)
    } catch {
      // Consent still works for the current session if storage is unavailable.
    }

    setConsent(normalizedConsent)

    return normalizedConsent
  }

  function acceptAll() {
    return saveConsent({
      version: 1,
      analytics: true,
      behaviorAnalytics: true,
    })
  }

  function rejectOptional() {
    return saveConsent({
      version: 1,
      analytics: false,
      behaviorAnalytics: false,
    })
  }

  function openPreferences() {
    setPreferencesOpen(true)
  }

  function closePreferences() {
    setPreferencesOpen(false)
  }

  const value = {
    consent,
    hasDecision: consent !== null,
    preferencesOpen,
    saveConsent,
    acceptAll,
    rejectOptional,
    openPreferences,
    closePreferences,
  }

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  )
}
