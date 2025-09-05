import {NavLink, Link} from 'react-router-dom'
import styles from './Navbar.module.scss'



export function LogoLink({ LogoSrc , altText, onClick }) {
    return (
        <Link to="/" 
            className={styles.logoLink}
            onClick={onClick}>
                <img src={LogoSrc} alt={altText}/>
        </Link>
    );
}


export default function Navbar({ onLinkClick }) {
  return (
    <nav className={styles.navbarContainer}>
      <ul className={styles.Container}>
        <li className={styles.Block}>
          <Link to="/" className={styles.navItem} onClick={onLinkClick}>
            Trang chủ
          </Link>
        </li>
        <li className={styles.Block}>
          <Link to="/activities" className={styles.navItem} onClick={onLinkClick}>
            Hoạt động
          </Link>
        </li>
        <li className={styles.Block}>
          <Link to="/about" className={styles.navItem} onClick={onLinkClick}>
            Giới thiệu
          </Link>
        </li>
        <li className={styles.Block}>
          <Link to="/contact" className={styles.navItem} onClick={onLinkClick}>
            Liên hệ
          </Link>
        </li>
      </ul>
    </nav>
  )
}
