import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";

export function Footer() {

  const handleClick = () => { 
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Logo and description */}
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <span className={styles.logoText}>VolunteerHub</span>
            </div>
            <p className={styles.description}>
              Nền tảng kết nối những trái tim thiện nguyện, xây dựng cộng đồng tốt đẹp và tạo ra
              những giá trị tích cực cho xã hội.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className={styles.heading}>Liên kết nhanh</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/activities" className={styles.link}
                  onClick={handleClick}>
                  Hoạt động thiện nguyện
                </Link>
              </li>
              <li>
                <Link to="/about" className={styles.link}
                  onClick={handleClick}>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" className={styles.link}
                  onClick={handleClick}>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className={styles.heading}>Hỗ trợ</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/help" className={styles.link}>
                  Trợ giúp
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={styles.link}>
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/terms" className={styles.link}>
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2024 VolunteerHub. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
