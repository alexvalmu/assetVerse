import { Link } from 'react-router-dom';
import { FaYoutube, FaTwitter, FaReddit } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link title="about" >ABOUT</Link>
        <Link title="faq" >FAQ</Link>
        <Link title="contact us" >CONTACT US</Link>
      </div>
      
      <div className="footer-icons">
        <p>&copy; {new Date().getFullYear()} All rights reserved</p>
        <a href="https://www.reddit.com" aria-label="reddit" title="reddit" target="_blank" rel="noopener noreferrer"><FaReddit /></a>
        <a href="https://www.youtube.com" aria-label="youtube" title="youtube" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
        <a href="https://www.twitter.com" aria-label="twitter" title="twitter" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
      </div>
    </footer>
  );
}

export default Footer;
