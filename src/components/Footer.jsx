import { Link } from 'react-router-dom'

import { useConsent } from '../context/useConsent'
import { useLanguage } from '../context/useLanguage'
import { getSocialLinksFor } from '../data/socialLinks'
import { routePaths } from '../router/routeConfig'

function Footer() {
  const currentYear = new Date().getFullYear()

  const { t } = useLanguage()
  const { openPreferences } = useConsent()

  const footerLinks = getSocialLinksFor('footer')

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {currentYear} Qarumi
        </p>

        <p className="footer__built">
          Built with React + Vite
        </p>

        <div className="footer__socials">
          {footerLinks.map((link) => (
            <a
              key={link.id}
              className="footer__social-link"
              href={link.href}
              {...(
                link.kind === 'external'
                  ? {
                      target: '_blank',
                      rel: 'noreferrer',
                    }
                  : {}
              )}
            >
              {t.contact.links[link.id] ?? link.label}
            </a>
          ))}
        </div>

        <div className="footer__legal">
          <Link
            className="footer__legal-link"
            to={routePaths.privacy}
          >
            {t.footer.privacy}
          </Link>

          <button
            type="button"
            className="footer__legal-link"
            onClick={openPreferences}
          >
            {t.footer.cookieSettings}
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
