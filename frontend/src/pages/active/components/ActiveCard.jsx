import React from 'react';
import { Card, CardContent } from '../../../components/shared/card/Card';
import { Badge } from '../../../components/shared/badge/Badge';
import Button from '../../../components/shared/button/Button';
import { Calendar, MapPin, Users } from 'lucide-react';
import styles from './ActiveCard.module.scss';
import { ROUTES } from '../../../const';

export default function ActiveCard({ activity }) {
	return (
		<Card className={styles.card}>
			<div className={styles.imageWrapper}>
				<img src={activity.images?.[0] || '/placeholder.png'} alt={activity.title || 'Hình ảnh hoạt động'} className={styles.image} loading='lazy' />
				<Badge className={styles.badge}>+{activity.points} điểm</Badge>
			</div>
			<CardContent className={styles.cardContent}>
				<h3 className={styles.cardTitle}>{activity.title}</h3>
				<div className={styles.details}>
					<div className={styles.detailItem}>
						<MapPin className={styles.icon} />
						<span>{activity.commune?.name}</span>
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
					<div className={styles.detailItem}>
						<span>Người tạo:</span>
						<span>{activity.createdBy?.name}</span>
					</div>
				</div>
				<div className={styles.btnWrapper}>
					<Button as='a' href={ROUTES.ACTIVE.withId(activity._id)} variant='primary' fillWidth>
						Xem chi tiết
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
