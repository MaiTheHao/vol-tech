import { ArrowRight, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.scss';
import { ROUTES } from '../../../const/index.js';

export function HeroSection() {
	return (
		<section className={styles.heroSection}>
			<div className={styles.container}>
				<div className={`${styles.content} fade-in`}>
					{/* Text */}
					<div className={styles.textBlock}>
						<h1 className={styles.title}>
							Kết nối trái tim <br />
							<span className={styles.accent}>thiện nguyện</span>
						</h1>
						<p className={styles.subtitle}>Tham gia cộng đồng tình nguyện viên, góp phần xây dựng xã hội tốt đẹp và tạo ra những giá trị tích cực cho cuộc sống</p>
					</div>

					{/* Buttons */}
					<div className={styles.actions}>
						<Link to={ROUTES.ACTIVE.path} className={`${styles.btn} ${styles.btnAccent}`}>
							Khám phá hoạt động
							<ArrowRight className={styles.icon} />
						</Link>
						<Link to={ROUTES.ABOUT.path} className={`${styles.btn} ${styles.btnOutline}`}>
							Tìm hiểu thêm
						</Link>
					</div>

					{/* Stats */}
					<div className={styles.stats}>
						<div className={styles.statItem}>
							<div className={styles.iconWrapper}>
								<Users className={styles.iconStat} />
							</div>
							<div>
								<div className={styles.statNumber}>5,000+</div>
								<div className={styles.statLabel}>Tình nguyện viên</div>
							</div>
						</div>
						<div className={styles.statItem}>
							<div className={styles.iconWrapper}>
								<Heart className={styles.iconStat} />
							</div>
							<div>
								<div className={styles.statNumber}>1,200+</div>
								<div className={styles.statLabel}>Hoạt động</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
