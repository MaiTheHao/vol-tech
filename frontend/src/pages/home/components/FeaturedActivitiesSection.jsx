import { Card, CardContent } from '../../../components/shared/card/Card';
import { Badge } from '../../../components/shared/badge/Badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import styles from './FeaturedActivitiesSection.module.scss';
import Button from '../../../components/shared/button/Button';
import { useEffect, useState } from 'react';
import { getList } from '../../../services/api/v1/active-api.service';
import { ROUTES } from '../../../const/index';
import AppSection from '../../../components/shared/app-section/AppSection';

// const featuredActivities = [
// 	{
// 		id: 1,
// 		name: 'Hỗ trợ trẻ em vùng cao',
// 		image: '/placeholder-cizgl.png',
// 		area: 'Hà Giang',
// 		date: '15/12/2024',
// 		currentParticipants: 25,
// 		capacity: 50,
// 		points: 100,
// 		status: 'open',
// 	},
// 	{
// 		id: 2,
// 		name: 'Dọn dẹp môi trường biển',
// 		image: '/placeholder-rjwvr.png',
// 		area: 'Đà Nẵng',
// 		date: '20/12/2024',
// 		currentParticipants: 40,
// 		capacity: 60,
// 		points: 80,
// 		status: 'open',
// 	},
// 	{
// 		id: 3,
// 		name: 'Chăm sóc người cao tuổi',
// 		image: '/placeholder-p4fuc.png',
// 		area: 'TP. Hồ Chí Minh',
// 		date: '22/12/2024',
// 		currentParticipants: 15,
// 		capacity: 30,
// 		points: 120,
// 		status: 'open',
// 	},
// ];

export function FeaturedActivitiesSection() {
	const [actives, setActives] = useState([]);
	const [errActives, setErrActives] = useState('');
	const [loadActives, setLoadActives] = useState(true);

	useEffect(() => {
		getList({ limit: 3, sortBy: 'points', sortOrder: 'desc' }).then(async (res) => {
			const data = await res.json();
			if (res.ok) setActives(data);
			else {
				setErrActives(data.error);
				setActives([]);
			}
		});
	}, []);

	return (
		<AppSection className={styles.featuredSection}>
			<div className={styles.header + ' fade-bottom-to-top'}>
				<h2 className={styles.title}>Hoạt động nổi bật</h2>
				<p className={styles.subtitle}>Tham gia các hoạt động thiện nguyện ý nghĩa và nhận điểm thưởng cho những đóng góp của bạn</p>
			</div>
			<div className={styles.grid}>
				{actives.map((activity, index) => (
					<Card key={activity._id} className={`${styles.card} fade-in`} style={{ animationDelay: `${index * 0.2}s` }}>
						<div className={styles.imageWrapper}>
							<img src={activity.images?.[0] || '/placeholder.png'} alt={activity.title || 'Hình ảnh hoạt động'} className={styles.image} loading='lazy' />
							<Badge className={styles.badge}>+{activity.points} điểm</Badge>
						</div>
						<CardContent className={styles.cardContent}>
							<h3 className={styles.cardTitle}>{activity.title}</h3>
							<div className={styles.details}>
								<div className={styles.detailItem}>
									<MapPin className={styles.icon} />
									<span>{activity.commune.name}</span>
								</div>
								<div className={styles.detailItem}>
									<Calendar className={styles.icon} />
									<span>{activity.startDate ? new Date(activity.startDate).toLocaleDateString('vi-VN') : ''}</span>
								</div>
								<div className={styles.detailItem}>
									<Users className={styles.icon} />
									<span>
										{activity.registeredUsers?.length || 0}/{activity.maxParticipants} người tham gia
									</span>
								</div>
							</div>
							<div className={styles.btnWrapper}>
								<Button as='a' href={ROUTES.ACTIVE.withId(activity._id)} variant='primary' fillWidth aria-label={`Xem chi tiết hoạt động ${activity.title}`}>
									Xem chi tiết
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</AppSection>
	);
}

export default FeaturedActivitiesSection;
