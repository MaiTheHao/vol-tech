import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import AppSection from '../../components/shared/app-section/AppSection';
import Button, { BUTTON_VARIANTS } from '../../components/shared/button/Button';
import { Badge } from '../../components/shared/badge/Badge';
import styles from './ActiveDetailPage.module.scss';
import { getDetail } from '../../services/api/v1/active-api.service';
import { MapPin, CalendarClock, Users, Home, Award } from 'lucide-react';

function formatDateRange(start, end) {
	const opts = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
	const s = new Date(start).toLocaleString('vi-VN', opts);
	const e = new Date(end).toLocaleString('vi-VN', opts);
	return `${s} - ${e}`;
}

export default function ActiveDetailPage() {
	const { id } = useParams();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		setLoading(true);
		const fetchDetail = async () => {
			try {
				const res = await getDetail(id);
				if (res.ok) {
					const detail = await res.json();
					setData(detail);
					setError('');
				} else {
					setError('Không tìm thấy hoạt động');
					setData(null);
				}
			} catch{
				setError('Đã xảy ra lỗi khi tải dữ liệu');
				setData(null);
			} finally {
				setLoading(false);
			}
		};
		fetchDetail();
	}, [id]);

	if (loading)
		return (
			<AppSection>
				<div className={styles.loading}>Đang tải...</div>
			</AppSection>
		);
	if (error)
		return (
			<AppSection>
				<div className={styles.error}>{error}</div>
			</AppSection>
		);
	if (!data) return null;

	return (
		<AppSection className={styles.detailSection}>
			<div className={styles.mainContent}>
				<div className={styles.left}>
					<div className='markdown'>
						<ReactMarkdown>{data.description}</ReactMarkdown>
					</div>
					<div className={styles.gallery}>
						{data.images && data.images.length > 0 ? (
							data.images.map((img, idx) => <img key={idx} src={img} alt={`Ảnh hoạt động ${idx + 1}`} className={styles.galleryImg} loading='lazy' />)
						) : (
							<div className={styles.noImage}>Không có ảnh</div>
						)}
					</div>
				</div>
				<aside className={styles.sidebar}>
					{/* Points */}
					<div className={styles.sidebarSection}>
						<Award size={20} className={styles.iconSidebar} />
						<span className={styles.points}>{data.points} điểm</span>
					</div>
					<div className={styles.sidebarSection}>
						<Users size={20} className={styles.iconSidebar} />
						<span>Tối đa: {data.maxParticipants} người</span>
					</div>
					<div className={styles.sidebarSection}>
						<MapPin size={20} className={styles.iconSidebar} />
						<span>{data.location}</span>
					</div>
					<div className={styles.sidebarSection}>
						<CalendarClock size={20} className={styles.iconSidebar} />
						<span>{formatDateRange(data.startDate, data.endDate)}</span>
					</div>
					{data.commune && (
						<div className={styles.sidebarSection}>
							<Home size={20} className={styles.iconSidebar} />
							<span>{data.commune.name}</span>
						</div>
					)}
					<div className={styles.actions}>
						<Button variant={BUTTON_VARIANTS.ACCENT} fillWidth disabled={data.status !== 'open'}>
							{data.status === 'open'
								? 'Đăng ký tham gia'
								: data.status === 'closed'
								? 'Đã đóng đăng ký'
								: data.status === 'completed'
								? 'Hoạt động đã hoàn thành'
								: data.status === 'cancelled'
								? 'Hoạt động đã hủy'
								: 'Không thể đăng ký'}
						</Button>
					</div>
				</aside>
			</div>
		</AppSection>
	);
}
