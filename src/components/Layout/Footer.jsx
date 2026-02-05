import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <span className="footer__logo">fever</span>
        </div>
        
        <div className="footer__section">
          <h4 className="footer__title">How fever works</h4>
          <ul className="footer__links">
            <li><a href="#">How to view the status of my plans</a></li>
            <li><a href="#">Billing Manual</a></li>
            <li><a href="#">How to validate tickets</a></li>
          </ul>
        </div>
        
        <div className="footer__section">
          <h4 className="footer__title">Support Contact</h4>
          <ul className="footer__links">
            <li><a href="tel:+34911876636">+34 911 87 66 36</a></li>
            <li>Monday to Friday (09:30 to 18:30)</li>
            <li><a href="#">Send us a message</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer__bottom">
        <p className="footer__copyright">©2024 - Fever | Made in Madrid & NYC</p>
        <span className="footer__version">v 0.00001</span>
      </div>
    </footer>
  )
}

export default Footer
