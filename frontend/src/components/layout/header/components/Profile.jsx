import styles from '../header.module.scss';

export function AvatarLink({ avatarSrc, altText }) {
	return (
		<div className={styles.avatarLink}>
			<img src={avatarSrc} alt={altText} />
		</div>
	);
}

export function PointLink({ pointSrc, pointText }) {
	return (
		<div className={styles.rank}>
			<div>{pointText}</div>
			<div>
				<img src={pointSrc} alt={pointText} />
			</div>
		</div>
	);
}

export default function UsernameLink({ user, loading }) {
	return <div className={styles.usernameLink}>{loading ? 'Đang tải...' : user?.name || 'Người dùng'}</div>;
}
