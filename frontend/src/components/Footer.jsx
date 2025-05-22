import { Link } from 'react-router-dom';
import { FaYoutube, FaTwitter, FaReddit } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link >ABOUT</Link>
        <Link >FAQ</Link>
        <Link >CONTACT US</Link>
      </div>
      
      <div className="footer-icons">
        <p>&copy; {new Date().getFullYear()} All rights reserved</p>
        <a href="https://www.reddit.com" aria-label="reddit" linktarget="_blank" rel="noopener noreferrer"><FaReddit /></a>
        <a href="https://www.youtube.com" aria-label="youtube" linktarget="_blank" rel="noopener noreferrer"><FaYoutube /></a>
        <a href="https://www.twitter.com" aria-label="twitter" linktarget="_blank" rel="noopener noreferrer"><FaTwitter /></a>
      </div>
    </footer>
  );
}

export default Footer;
