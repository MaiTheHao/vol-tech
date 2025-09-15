import { Link } from 'react-router-dom';
import styles from "./footer.module.scss";
import LogoBlue from "../../../assets/logos/Logo-VOLTECH--Blue.svg"
import { LogoLink } from '../header/components/Navbar';

export default function Footer() {

    const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }



  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Logo and description */}
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <LogoLink
                LogoSrc={LogoBlue}
                altText="VOLtech Logo"
                onClick={handleClick}
              />
            </div>
            <p className={styles.description}>
              Nền tảng kết nối những trái tim thiện nguyện, xây dựng cộng đồng tốt đẹp và tạo ra những giá trị tích cực
              cho xã hội.
            </p>
          </div>
          <div className={styles.Section}>
            {/* Quick links */}
            <div className={styles.linksSection}>
              <h3 className={styles.linksTitle}>Liên kết nhanh</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link to="/activities" className={styles.link}>Hoạt động thiện nguyện</Link>
                </li>
                <li>
                  <Link to="/about" className={styles.link}>Giới thiệu</Link>
                </li>
                <li>
                  <Link to="/contact" className={styles.link}>Liên hệ</Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className={styles.linksSection}>
              <h3 className={styles.linksTitle}>Hỗ trợ</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link to="/help" className={styles.link}>Trợ giúp</Link>
                </li>
                <li>
                  <Link to="/privacy" className={styles.link}>Chính sách bảo mật</Link>
                </li>
                <li>
                  <Link to="/terms" className={styles.link}>Điều khoản sử dụng</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p className={styles.bottomText}>© 2024 VolunteerHub.</p>
        </div>
      </div>
    </footer>
  );
}
