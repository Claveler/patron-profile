import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <img src="/fever-logo-white.svg" alt="Fever Logo" className="footer__logo" />
        
        <div className="footer__links">
          <div className="info-column">
            <span className="info-column__title">How Fever Works</span>
            <a href="#" className="info-column__link">FeverZone Guide</a>
            <a href="#" className="info-column__link">Frequently Asked Questions</a>
            <a href="#" className="info-column__link">Validation Guide</a>
            <a href="#" className="info-column__link">How to validate tickets</a>
          </div>
          
          <div className="info-column">
            <span className="info-column__title">Partners' support contact</span>
            <a href="tel:+16672443490" className="info-column__link">(667) 244-3490</a>
            <span className="info-column__link">Monday to Friday (08:00 - 20:30)</span>
            <a href="#" className="info-column__link">Send us a message</a>
          </div>
        </div>
      </div>
      
      <div className="footer__separator"></div>
      
      <div className="footer__copyright">
        <p>©2026 Fever</p>
        <p>v. 12.0.2</p>
      </div>
    </footer>
  )
}

export default Footer
