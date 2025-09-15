import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './register.module.scss';
import { register } from '../../services/api/v1/auth-api.service';
import Input from '../../components/input/Input';

export default function Register() {
    const [name, setName] =useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (email.trim() === '' || password.trim() === '' || name.trim() === '') {
			setError('Vui lòng điền đầy đủ thông tin email và mật khẩu');
			return;
		}

		if (password !== confirmPassword) {
			setError("Mật khẩu không khớp");
			setLoading(false)
			return;
		} else {
			setError("");
		}
		setLoading(true);
		setError(null);

		try {
			const user = await register(email, password);
			localStorage.setItem('user', JSON.stringify(user));
			navigate('/');
		} catch (err) {
			setError(err.message || 'Register thất bại');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.RegisterPage}>
			<div className={styles.container}>
				<div className={styles.content}>
					<h1 className={styles.title}>Đăng kí</h1>
					<form onSubmit={handleSubmit} className={styles.form}>
						<Input name='name' label='Tên người dùng' type='name' placeholder='Nhập tên người dùng' value={name} onChange={(e) => setName(e.target.value)} error={error && error.includes('name') ? error : ''} />
						<Input name='email' label='Email' type='email' placeholder='Nhập email' value={email} onChange={(e) => setEmail(e.target.value)} error={error && error.includes('email') ? error : ''} />
                        <Input name='password' label='Mật khẩu' type='password' placeholder='Nhập mật khẩu' value={password} onChange={(e) => setPassword(e.target.value)} error={error && error.includes('password') ? error : ''} />
                        <Input name='confirmPassword' label='Xác nhận mật khẩu' type='password' placeholder='Nhập lại mật khẩu' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={error && error.includes('password') ? error : ''} />
						<div className={styles.submit}>
							<button type='submit' disabled={loading}>
								{loading ? 'Đang đăng kí...' : 'Đăng kí'}
							</button>
						</div>
						{error && !error.includes('email') && !error.includes('password') && <p className={styles.error}>{error}</p>}
					</form>
					<p className={styles.registerText}>
						Đã có tài khoản? <Link to='/login'>Đăng nhập</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

// //regexe
// //zod




