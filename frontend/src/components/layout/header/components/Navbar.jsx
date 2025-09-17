import { NavLink } from 'react-router-dom';
import styles from '../header.module.scss';
import { useState, useMemo } from 'react';
import { ROUTES } from '../../../../const/index.js';

export default function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);

	const handleToTop = () => {
		setMenuOpen(false);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const navRoutes = useMemo(
		() => [
			{ path: ROUTES.HOME.path, label: 'Trang chủ' },
			{ path: ROUTES.ACTIVE.path, label: 'Hoạt động' },
			{ path: ROUTES.ABOUT.path, label: 'Giới thiệu' },
		],
		[]
	);

	return (
		<nav className={styles.navbar}>
			<div className={styles.navbarContainer}>
				{navRoutes.map((route, idx) => (
					<div className={styles.navBlock} key={route.path}>
						<NavLink to={route.path} className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.active}` : styles.navItem)} onClick={handleToTop}>
							{route.label}
							{idx === 0 && <div className={`${styles.navDesktop} ${menuOpen ? styles.show : ''}`}></div>}
						</NavLink>
					</div>
				))}
			</div>
		</nav>
	);
}
