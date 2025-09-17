import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './header.module.scss';
import Navbar, { LogoLink } from './components/Navbar';
import UsernameLink, { AvatarLink, PointLink } from './components/Profile';
import LogoBlue from '../../../assets/logos/Logo-VOLTECH--Blue.svg';
import AvatarIcon from '../../../assets/Icons/IconProfile.svg';
import RankIcon from '../../../assets/Icons/IconPoint.svg';
import { ROUTES } from '../../../const';
import useAuthContext from '../../../contexts/auth/useAuthContext.jsx';

export default function Header() {
	const [menuOpen, setMenuOpen] = useState(false);
	const { isAuth, user, loading } = useAuthContext();

	const handleClick = () => {
		setMenuOpen(false);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<header className={styles.Header}>
			<div className={`Container ${styles.Container}`}>
				<div className={styles.headerLeft}>
					<LogoLink LogoSrc={LogoBlue} altText='VOLtech Logo' onClick={handleClick} />
				</div>
				<div className={`${styles.defaultNav} ${menuOpen ? styles.show : ''}`}>
					<Navbar />
				</div>

				<div className={styles.headerRight}>
					{isAuth && user ? (
						<Link className={styles.profileButton} to={ROUTES.PROFILE.path}>
							<div className={styles.info}>
								<UsernameLink user={user} loading={loading} />
								<PointLink pointText={user?.score ?? 0} pointSrc={RankIcon} />
							</div>
							<AvatarLink avatarSrc={user?.avatar || AvatarIcon} altText={user?.name || 'Loading'} />
						</Link>
					) : (
						<div className={styles.authButtons}>
							<Link to={ROUTES.LOGIN.path} className={styles.buttonGhost}>
								Đăng nhập
							</Link>
						</div>
					)}

					<button type='button' onClick={() => setMenuOpen(!menuOpen)} aria-label='Mở menu' className={`${styles.menuToggle} ${menuOpen ? styles.active : ''}`}>
						<span></span>
						<span></span>
						<span></span>
					</button>
				</div>
			</div>

			{menuOpen && (
				<div className={styles.minimalNav}>
					<Navbar />
				</div>
			)}
		</header>
	);
}
