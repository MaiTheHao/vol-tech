"use client"

import {  useState } from 'react'
import { Crown, User } from "lucide-react"
import { Button } from "../../ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar"
import Navbar, {LogoLink} from './component/Navbar'
import LogoBlue from '../../../assets/Logo/Logo-VOLTECH--Blue.svg';


import { Link } from "react-router-dom"
import styles from "./Header.module.scss"

export function Header({ isLoggedIn = false, user }) {

  const [menuOpen, setMenuOpen] = useState(false);
  
      const handleClick = () => {
          setMenuOpen(false); 
          window.scrollTo({ top: 0, behavior: "smooth" }); 
      };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.Logo}>    
              <LogoLink 
                  LogoSrc={LogoBlue}    
                  altText="VOLtech Logo"
                  onClick={handleClick} />   
          </div>
          {/* Navigation */}
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}
              onClick={handleClick}>
              Trang chủ
            </Link>
            <Link to="/activities" className={styles.navLink}
              onClick={handleClick}>
              Hoạt động
            </Link>
            <Link to="/about" className={styles.navLink}
              onClick={handleClick}>
              Giới thiệu
            </Link>
            <Link to="/contact" className={styles.navLink}
              onClick={handleClick}>
              Liên hệ
            </Link>
          </nav>

          {/* User section */}
          <div className={styles.userSection}>
            {isLoggedIn && user ? (
              <div className={styles.userInfoWrapper}>
                <div className={styles.userText}>
                <Link to="/profile" className={styles.profileLink}>
                  <span className={styles.username}>{user.name}</span>
                </Link>
                  <div className={styles.points}>
                    <Crown className={styles.crown} />
                    <span className={styles.pointValue}>{user.points}</span>
                  </div>
                </div>

                <Link to="/profile" className={styles.profileLink}>
                  <Avatar className={styles.avatar}>
                    <AvatarImage src={user.avatar || "frontend/src/assets/Avatar/placeholder.png"} alt='' />
                    <AvatarFallback>
                      <User className={styles.userIcon} />
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>

          <button
            type='button'
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label='Mở menu'
              className={`${styles.menuToggle} ${menuOpen ? styles.active : ''}`}
          >
              <span></span>
              <span></span>
              <span></span>  
          </button>          
        </div>
      </div>
      {
        menuOpen && (
          <div className={styles.minimalNav}>
            <Navbar onLinkClick={handleClick}/>
          </div>
        )
      }
    </header>
  )
}
