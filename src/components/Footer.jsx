import { getSocialLinksFor } from '../data/socialLinks'

import { useLanguage } from '../context/useLanguage'

function Footer() {
  const { t } = useLanguage()

  const currentYear = new Date().getFullYear()

  const footerLinks = getSocialLinksFor('footer')

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p>
            © {currentYear} Qarumi
          </p>

          <div className="footer__socials">
            {footerLinks.map((link) => (
              <a
                href={link.href}
                target={link.kind === 'external' ? '_blank' : undefined}
                rel={link.kind === 'external' ? 'noreferrer' : undefined}
                className="footer__social-link"
                key={link.id}
              >
                {t.contact.links[link.id] ?? link.label}
              </a>
            ))}
          </div>
        </div>

        <p className="footer__built">
          Built with React + Vite
        </p>
      </div>
    </footer>
  )
}

export default Footer
