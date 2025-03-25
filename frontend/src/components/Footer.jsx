import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()}All rights reserved.</p>
        <nav>
          <Link to="/privacy-policy">About</Link>
          <Link to="/terms-of-service">FAQ</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
