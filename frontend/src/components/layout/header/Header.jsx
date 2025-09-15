import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./header.module.scss"
import Navbar, { LogoLink } from "./components/Navbar"
import UsernameLink, { AvatarLink, PointLink } from "./components/Profile"
import LogoBlue from "../../../assets/logos/Logo-VOLTECH--Blue.svg"
import AvatarIcon from "../../../assets/Icons/IconProfile.svg"
import RankIcon from "../../../assets/Icons/IconPoint.svg"
import PropTypes from "prop-types"







export  default function  Header({ isLoggedIn = false, user }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleClick = () => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }



  return (
    <header className={styles.Header}>
      <div className={`Container ${styles.Container}`}>

        <div className={styles.headerLeft}>
          <LogoLink
            LogoSrc={LogoBlue}
            altText="VOLtech Logo"
            onClick={handleClick}
          />
        </div>
        <div className={`${styles.defaultNav} ${menuOpen ? styles.show : ""}`}>
          <Navbar />
        </div>


        <div className={styles.headerRight}>
          {isLoggedIn && user ? (
            <div className={styles.profileButton}>
              <div className={styles.info}>
                <UsernameLink />
                <PointLink
                  pointText='1112'
                  pointSrc={RankIcon}
                />
              </div>
                <AvatarLink
                  avatarSrc={AvatarIcon}
                  altText='Loading'
                />
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.buttonGhost}>
                Đăng nhập
              </Link>
              <Link to="/register" className={styles.buttonPrimary}>
                Đăng ký
              </Link>
            </div>
          )}


          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Mở menu"
            className={`${styles.menuToggle} ${
              menuOpen ? styles.active : ""
            }`}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.minimalNav}>
          <Navbar/>
        </div>
      )}
    </header>
  )
}

  Header.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    points: PropTypes.number.isRequired
  })
}


