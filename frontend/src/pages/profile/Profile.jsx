import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.scss';
import useAuthContext from '../../contexts/auth/useAuthContext.jsx';
import AvatarPlaceholder from '../../assets/imgs/avatar-placeholder.png';

export default function Profile() {
  const { user, loading, logout } = useAuthContext();
  const navigate = useNavigate();

  if (loading) return <p>Đang tải thông tin...</p>;

  if (!user) {
    return <p>Bạn chưa đăng nhập. Vui lòng đăng nhập để xem thông tin.</p>;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login'); 
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.avatarSection}>
        <img
          src={user.avatar || AvatarPlaceholder}
          alt="Avatar"
          className={styles.avatar}
        />
      </div>

      <h1>Thông tin cá nhân</h1>

      <div className={styles.infoCard}>
        <div className={styles.row}>
          <span className={styles.label}>Tên:</span>
          <span className={styles.value}>{user.name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Email:</span>
          <span className={styles.value}>{user.email}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Ngày sinh:</span>
          <span className={styles.value}>
            {user.birthDate
              ? new Date(user.birthDate).toLocaleDateString('vi-VN')
              : 'Chưa cập nhật'}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Đơn vị:</span>
          <span className={styles.value}>{user.unit || 'Chưa cập nhật'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Số điện thoại:</span>
          <span className={styles.value}>{user.phone || 'Chưa cập nhật'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Điểm:</span>
          <span className={styles.value}>{user.points ?? 0}</span>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
