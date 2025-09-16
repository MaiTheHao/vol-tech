import { NavLink, Link } from 'react-router-dom';
import styles from '../header.module.scss';
import { ROUTES } from '../../../../const/index.js';

export function AvatarLink({ avatarSrc, altText }) {
	return (
		<Link to={ROUTES.PROFILE.path} className={styles.avatarLink}>
			<img src={avatarSrc} alt={altText} />
		</Link>
	);
}

export function PointLink({ pointSrc, pointText }) {
	return (
		<NavLink to={ROUTES.PROFILE.path} className={styles.rank}>
			<div>{pointText}</div>
			<div>
				<img src={pointSrc} alt={pointText} />
			</div>
		</NavLink>
	);
}

export default function UsernameLink({ user, loading }) {
	return (
		<NavLink to={ROUTES.PROFILE.path} className={({ isActive }) => (isActive ? `${styles.usernameLink} ${styles.active}` : styles.usernameLink)}>
			{loading ? 'Đang tải...' : user?.name || 'Người dùng'}
		</NavLink>
	);
}
