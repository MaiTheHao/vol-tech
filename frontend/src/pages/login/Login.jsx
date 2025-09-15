// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import styles from './login.module.scss';
// import { login } from '../../services/api/v1/auth-api.service';
// import Input from '../../components/input/Input';

// export default function Login() {
// 	const [email, setEmail] = useState('');
// 	const [password, setPassword] = useState('');
// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState(null);
// 	const navigate = useNavigate();

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		if (email.trim() === '' || password.trim() === '') {
// 			setError('Vui lòng điền đầy đủ thông tin email và mật khẩu');
// 			return;
// 		}

// 		setLoading(true);
// 		setError(null);

// 		try {
// 			const user = await login(email, password);
// 			localStorage.setItem('user', JSON.stringify(user));
// 			navigate('/');
// 		} catch (err) {
// 			setError(err.message || 'Login thất bại');
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<div className={styles.loginPage}>
// 			<div className={styles.container}>
// 				<div className={styles.content}>
// 					<h1 className={styles.title}>Đăng nhập</h1>
// 					<form onSubmit={handleSubmit} className={styles.form}>
// 						<Input name='email' label='Email' type='email' placeholder='Nhập email' value={email} onChange={(e) => setEmail(e.target.value)} error={error && error.includes('email') ? error : ''} />
// 						<Input name='password' label='Mật khẩu' type='password' placeholder='Nhập mật khẩu' value={password} onChange={(e) => setPassword(e.target.value)} error={error && error.includes('password') ? error : ''} />
// 						<div className={styles.submit}>
// 							<button type='submit' disabled={loading}>
// 								{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
// 							</button>
// 						</div>
// 						{error && !error.includes('email') && !error.includes('password') && <p className={styles.error}>{error}</p>}
// 					</form>
// 					<p className={styles.registerText}>
// 						Chưa có tài khoản? <Link to='/register'>Đăng ký</Link>
// 					</p>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.scss';
import { login } from '../../services/api/v1/auth-api.service';
import { getMe } from '../../services/api/v1/user-api.service';
import LocalStorageService, { LOCAL_STORAGE_KEYS } from '../../services/storage/local-storage.service';
import Input from '../../components/input/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ thông tin email và mật khẩu');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Gọi API login
      const { accessToken } = await login(email, password);

      // Lưu token vào LocalStorage qua service
      LocalStorageService.set(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);

      // Lấy thông tin user bằng token
      const user = await getMe(accessToken);

      // Lưu user info vào localStorage
      LocalStorageService.set('user', user);

      // Chuyển hướng
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Đăng nhập</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error && error.includes('email') ? error : ''}
            />
            <Input
              name="password"
              label="Mật khẩu"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error && error.includes('password') ? error : ''}
            />
            <div className={styles.submit}>
              <button type="submit" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>
            {error && !error.includes('email') && !error.includes('password') && (
              <p className={styles.error}>{error}</p>
            )}
          </form>
          <p className={styles.registerText}>
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </div>
      </div>
    </div>
  );
}






