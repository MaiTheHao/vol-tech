import AppSection from '../../components/shared/app-section/AppSection';
import styles from './AboutPage.module.scss';
import { Users, Award, MapPin, Building2, Phone, Mail, Github, Linkedin, Facebook, Flame } from 'lucide-react';

export default function AboutPage() {
	return (
		<AppSection className={styles.aboutSection}>
			<h1 className={styles.title}>Giới thiệu về VolTech</h1>
			<div className={styles.description}>
				<p>VolTech là nền tảng kết nối các hoạt động tình nguyện, giúp các bạn trẻ dễ dàng tìm kiếm và tham gia các chương trình ý nghĩa.</p>
				<p>Chúng tôi mong muốn xây dựng cộng đồng tình nguyện năng động, sáng tạo và lan tỏa giá trị tốt đẹp đến xã hội.</p>
			</div>

			<div className={styles.infoGrid}>
				<div className={styles.enterpriseInfo}>
					<h3 className={styles.sectionTitle}>Thông tin công ty</h3>
					<div className={styles.infoItem}>
						<Building2 size={22} className={`${styles.icon} ${styles.iconPrimary}`} />
						<span>Công ty TNHH VolTech</span>
					</div>
					<div className={styles.infoItem}>
						<MapPin size={22} className={`${styles.icon} ${styles.iconAccent}`} />
						<span>123 Đường Tình Nguyện, Quận 1, TP.HCM</span>
					</div>
					<div className={styles.infoItem}>
						<Phone size={22} className={`${styles.icon} ${styles.iconPrimary}`} />
						<span>0123 456 789</span>
					</div>
					<div className={styles.infoItem}>
						<Mail size={22} className={`${styles.icon} ${styles.iconAccent}`} />
						<span>contact@voltech.vn</span>
					</div>
					<div className={styles.infoItem}>
						<span role='img' aria-label='Vietnam Flag' style={{ fontSize: 22, marginRight: 8 }}>
							🇻🇳
						</span>
						<span>Việt Nam</span>
					</div>
				</div>

				<div className={styles.statsSection}>
					<h3 className={styles.sectionTitle}>Thống kê</h3>
					<div className={styles.stats}>
						<div className={styles.statItem}>
							<Users size={24} className={`${styles.iconStat} ${styles.iconPrimary}`} />
							<span className={styles.points}>1000+ tình nguyện viên</span>
						</div>
						<div className={styles.statItem}>
							<Award size={24} className={`${styles.iconStat} ${styles.iconAccent}`} />
							<span>50+ hoạt động mỗi năm</span>
						</div>
						<div className={styles.statItem}>
							<Flame size={24} className={`${styles.iconStat} ${styles.iconPrimary}`} />
							<span>Kết nối cộng đồng</span>
						</div>
					</div>
				</div>
			</div>

			<div className={styles.socialSection}>
				<h3 className={styles.sectionTitle}>Kết nối với chúng tôi</h3>
				<div className={styles.socials}>
					<a href='https://github.com/voltech' target='_blank' rel='noopener noreferrer' className={`${styles.socialCircle} ${styles.socialPrimary}`} title='Github'>
						<Github size={20} />
					</a>
					<a href='https://linkedin.com/company/voltech' target='_blank' rel='noopener noreferrer' className={`${styles.socialCircle} ${styles.socialAccent}`} title='LinkedIn'>
						<Linkedin size={20} />
					</a>
					<a href='https://facebook.com/voltech' target='_blank' rel='noopener noreferrer' className={`${styles.socialCircle} ${styles.socialPrimary}`} title='Facebook'>
						<Facebook size={20} />
					</a>
					<a href='mailto:contact@voltech.vn' className={`${styles.socialCircle} ${styles.socialAccent}`} title='Email'>
						<Mail size={20} />
					</a>
				</div>
			</div>
		</AppSection>
	);
}
