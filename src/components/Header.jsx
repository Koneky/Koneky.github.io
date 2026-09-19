import { useLanguage } from '../context/useLanguage'

function Header() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="header">
      <div className="container header__inner">
        <a href="/" className="logo">
          Koneky<span>.</span>
        </a>

        <div className="header__right">
          <nav className="nav">
            <a href="#about">{t.nav.about}</a>
            <a href="#stack">{t.nav.stack}</a>
            <a href="#projects">{t.nav.projects}</a>
            <a href="#contact">{t.nav.contact}</a>
          </nav>

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
        </div>
      </div>
    </header>
  )
}

export default Header
