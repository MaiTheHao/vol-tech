import {NavLink, Link} from 'react-router-dom'
import styles from '../header.module.scss'
import {useState} from 'react'



export function LogoLink({ LogoSrc , altText, onClick }) {
    return (
        <Link to="/" 
            className={styles.logoLink}
            onClick={onClick}>
                <img src={LogoSrc} alt={altText}/>
        </Link>
    );
}


export default function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    
    const handleButtonClick = () => {
        setMenuOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return(
        <div>
            <nav className={styles.navbar}>
                <div className={styles.ContainerNavbar}>
                    <div className={styles.Block}>
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                            }
                            onClick={handleButtonClick}
                        >
                            Trang chủ
                            <div className={`${styles.defaultNav} ${menuOpen ? styles.show : ''}`}></div>
                        </NavLink>
                    </div>
                    <div className={styles.Block}>
                        <NavLink 
                            to="/Active" 
                            className={({ isActive }) => 
                                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                            }
                        >
                            Hoạt động
                        </NavLink>
                    </div>
                    <div className={styles.Block}>
                        <NavLink 
                            to="/about" 
                            className={({ isActive }) => 
                                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                            }
                        >
                            Giới thiệu
                        </NavLink>
                    </div>
                </div>   
            </nav>
        </div> 
    )
}