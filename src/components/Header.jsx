import { useEffect, useState } from 'react'
import {
  Link,
  useLocation,
} from 'react-router-dom'

import { useLanguage } from '../context/useLanguage'
import { useCommandUI } from '../context/useCommandUI'
import { routePaths } from '../router/routeConfig'
import { getHomeSectionTarget } from '../utils/navigation'

const sections = [
  'about',
  'stack',
  'projects',
  'contact',
]

function Header() {
  const { language, setLanguage, t } = useLanguage()
  const { openPalette } = useCommandUI()
  const location = useLocation()

  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (location.pathname !== routePaths.home) {
      return
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const documentHeight =
        document.documentElement.scrollHeight

      const isAtBottom =
        scrollY + viewportHeight >= documentHeight - 10

      if (isAtBottom) {
        setActiveSection(sections[sections.length - 1])
        return
      }

      const activationPoint =
        scrollY + viewportHeight * 0.4

      let currentSection = ''

      sections.forEach((id) => {
        const section =
          document.getElementById(id)

        if (!section) {
          return
        }

        if (section.offsetTop <= activationPoint) {
          currentSection = id
        }
      })

      setActiveSection(currentSection)
    }

    handleScroll()

    window.addEventListener(
      'scroll',
      handleScroll,
      {
        passive: true,
      },
    )

    window.addEventListener(
      'resize',
      handleScroll,
    )

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      )

      window.removeEventListener(
        'resize',
        handleScroll,
      )
    }
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen
      ? 'hidden'
      : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleNavigation = () => {
    setMenuOpen(false)
  }

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage)
    setMenuOpen(false)
  }

  const getLinkClass = (section) => {
    const isActive =
      location.pathname === routePaths.home &&
      activeSection === section

    return isActive
      ? 'nav__link active'
      : 'nav__link'
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Link
          to={routePaths.home}
          className="logo"
          onClick={() => setMenuOpen(false)}
        >
          Qarumi<span>.</span>
        </Link>

        <div className="header__right">
          <nav
            className={
              menuOpen
                ? 'nav nav--open'
                : 'nav'
            }
          >
            <Link
              to={getHomeSectionTarget('about')}
              className={getLinkClass('about')}
              onClick={handleNavigation}
            >
              {t.nav.about}
            </Link>

            <Link
              to={getHomeSectionTarget('stack')}
              className={getLinkClass('stack')}
              onClick={handleNavigation}
            >
              {t.nav.stack}
            </Link>

            <Link
              to={getHomeSectionTarget('projects')}
              className={getLinkClass('projects')}
              onClick={handleNavigation}
            >
              {t.nav.projects}
            </Link>

            <Link
              to={getHomeSectionTarget('contact')}
              className={getLinkClass('contact')}
              onClick={handleNavigation}
            >
              {t.nav.contact}
            </Link>

            <div className="nav__mobile-language">
              <button
                className={
                  language === 'en'
                    ? 'language-switcher__button active'
                    : 'language-switcher__button'
                }
                onClick={() => changeLanguage('en')}
              >
                EN
              </button>

              <span>/</span>

              <button
                className={
                  language === 'ru'
                    ? 'language-switcher__button active'
                    : 'language-switcher__button'
                }
                onClick={() => changeLanguage('ru')}
              >
                RU
              </button>
            </div>
          </nav>

          <button
            type="button"
            className="header__command-trigger"
            onClick={() => {
              setMenuOpen(false)
              openPalette()
            }}
            aria-label={t.commandPalette.open}
            aria-haspopup="dialog"
          >

            <svg
              className="header__command-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <span
              className="header__command-shortcut"
              aria-hidden="true"
            >
              Ctrl / ⌘ + K
            </span>
          </button>

          <div className="language-switcher">
            <button
              className={
                language === 'en'
                  ? 'language-switcher__button active'
                  : 'language-switcher__button'
              }
              onClick={() => setLanguage('en')}
            >
              EN
            </button>

            <span>/</span>

            <button
              className={
                language === 'ru'
                  ? 'language-switcher__button active'
                  : 'language-switcher__button'
              }
              onClick={() => setLanguage('ru')}
            >
              RU
            </button>
          </div>

          <button
            className={
              menuOpen
                ? 'menu-button active'
                : 'menu-button'
            }
            onClick={() => {
              setMenuOpen((prev) => !prev)
            }}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
