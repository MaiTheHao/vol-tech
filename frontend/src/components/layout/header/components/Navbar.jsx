import { NavLink, Link } from 'react-router-dom';
import styles from '../header.module.scss';
import { useState } from 'react';
import { ROUTES } from '../../../../const/index.js';

export function LogoLink({ LogoSrc, altText, onClick }) {
	return (
		<Link to={ROUTES.HOME.path} className={styles.logoLink} onClick={onClick}>
			<img src={LogoSrc} alt={altText} />
		</Link>
	);
}

export default function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);

	const handleButtonClick = () => {
		setMenuOpen(false);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div>
			<nav className={styles.navbar}>
				<div className={styles.ContainerNavbar}>
					<div className={styles.Block}>
						<NavLink to={ROUTES.HOME.path} className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.active}` : styles.navItem)} onClick={handleButtonClick}>
							Trang chủ
							<div className={`${styles.defaultNav} ${menuOpen ? styles.show : ''}`}></div>
						</NavLink>
					</div>
					<div className={styles.Block}>
						<NavLink to={ROUTES.ACTIVE.path} className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.active}` : styles.navItem)}>
							Hoạt động
						</NavLink>
					</div>
					<div className={styles.Block}>
						<NavLink to={ROUTES.ABOUT.path} className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.active}` : styles.navItem)}>
							Giới thiệu
						</NavLink>
					</div>
				</div>
			</nav>
		</div>
	);
}
