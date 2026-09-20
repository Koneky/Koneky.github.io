function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {currentYear} Qarumi
        </p>

        <p className="footer__built">
          Built with React + Vite
        </p>
      </div>
    </footer>
  )
}

export default Footer
