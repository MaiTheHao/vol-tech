import { Crown, User } from "lucide-react"
import { Link } from "react-router-dom"
import styles from "./Header.module.scss"

export function Header({ isLoggedIn = false, user }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link to="/" className={styles.logoWrapper}>
            <div className={styles.logo}>
              <span className={styles.logoText}>VolunteerHub</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Trang chủ</Link>
            <Link to="/activities" className={styles.navLink}>Hoạt động</Link>
            <Link to="/about" className={styles.navLink}>Giới thiệu</Link>
            <Link to="/contact" className={styles.navLink}>Liên hệ</Link>
          </nav>

          {/* User section */}
          <div className={styles.userSection}>
            {isLoggedIn && user ? (
              <div className={styles.userInfo}>
                <div className={styles.points}>
                  <Crown className={styles.crownIcon} />
                  <span>{user.points}</span>
                </div>
                <Link to="/profile" className={styles.profileLink}>
                  <div className={styles.avatarWrapper}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className={styles.avatar} />
                    ) : (
                      <User className={styles.userIcon} />
                    )}
                  </div>
                  <span>{user.name}</span>
                </Link>
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link to="/login" className={styles.buttonGhost}>Đăng nhập</Link>
                <Link to="/register" className={styles.buttonPrimary}>Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
