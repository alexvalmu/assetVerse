import { Link } from 'react-router-dom';
import { FaYoutube, FaTwitter, FaReddit } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/about">ABOUT</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/contact">CONTACT US</Link>
      </div>
      
      <div className="footer-icons">
        <p>&copy; {new Date().getFullYear()} All rights reserved</p>
        <a href="https://www.reddit.com" target="_blank" rel="noopener noreferrer"><FaReddit /></a>
        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
      </div>
    </footer>
  );
}

export default Footer;
