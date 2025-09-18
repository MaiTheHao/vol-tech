import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.scss';
import useAuthContext from '../../contexts/auth/useAuthContext.jsx';
import AvatarPlaceholder from '../../assets/imgs/avatar-placeholder.png';
import { FaCrown } from 'react-icons/fa';

export default function Profile() {
  const { user, loading: userLoading, logout } = useAuthContext();
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState(null);
  const [rankData, setRankData] = useState([]);

    useEffect(() => {
    const fetchRanking = async () => {
      try {

        const fakeData = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `Người dùng ${i + 1}`,
          points: Math.floor(Math.random() * 1000),
        }));
        setRankData(fakeData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRanking();
  }, []);

  if (userLoading) return <p>Đang tải thông tin...</p>;

  const handleLogout = async () => {
    setLogoutError(null);
    setLogoutLoading(true);

    try {
      await logout();
      setTimeout(() => navigate('/home'), 500);
    } catch (err) {
      console.error(err);
      setLogoutError('Đăng xuất thất bại. Vui lòng thử lại.');
      setLogoutLoading(false);
    }
  };


  return (
    <div className={styles.Profile}>
      <div className={`${styles.logoutOverlay} ${logoutLoading ? styles.active : ''}`}>
        Đang đăng xuất...
      </div>

      <div className={styles.profilePage}>
        <div className={styles.leftCol}>
          <div className={styles.avatarSection}>
            <img
              src={user?.avatar || AvatarPlaceholder}
              alt="Avatar"
              className={styles.avatar}
            />
          </div>

          <div className={styles.infoCard}>
            <div className={styles.row}>
              <span className={styles.label}>Tên:</span>
              <span className={styles.value}>{user?.name || 'Chưa cập nhật'}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{user?.email || 'Chưa cập nhật'}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Ngày sinh:</span>
              <span className={styles.value}>
                {user?.birthDate ? new Date(user.birthDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Đơn vị:</span>
              <span className={styles.value}>{user?.unit || 'Chưa cập nhật'}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Số điện thoại:</span>
              <span className={styles.value}>{user?.phone || 'Chưa cập nhật'}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Điểm:</span>
              <span className={styles.value}>{user?.points ?? 0}</span>
            </div>

            {logoutError && <div className={styles.error}>{logoutError}</div>}

            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
            </button>
          </div>
        </div>

      </div>
      <div className={styles.rankBoard}>
        <h2>Bảng xếp hạng</h2>
        <ul>
          {rankData.map((user, index) => (
            <li key={user.id} className={styles.rankItem}>
              <span className={styles.rank}>{index + 1}</span>
              <span className={styles.name}>
                {user.name}
                {index === 0 && <FaCrown className={styles.crown} />}
              </span>
              <span className={styles.points}>{user.points} điểm</span>
            </li>
          ))}
        </ul>
      </div>        
    </div>
  );
}
