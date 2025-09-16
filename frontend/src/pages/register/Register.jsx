import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth-form/AuthForm.jsx';
import useAuthContext from '../../contexts/auth/useAuthContext.jsx';

const fields = [
	{ name: 'name', label: 'Tên người dùng', type: 'text', placeholder: 'Nhập tên người dùng' },
	{ name: 'email', label: 'Email', type: 'email', placeholder: 'Nhập email' },
	{ name: 'birthDate', label: 'Ngày sinh', type: 'date', placeholder: 'Chọn ngày sinh' },
	{ name: 'unit', label: 'Đơn vị', type: 'text', placeholder: 'Nhập đơn vị' },
	{ name: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: 'Nhập số điện thoại' },
	{ name: 'password', label: 'Mật khẩu', type: 'password', placeholder: 'Nhập mật khẩu' },
	{ name: 'confirmPassword', label: 'Xác nhận mật khẩu', type: 'password', placeholder: 'Nhập lại mật khẩu' },
];

export default function Register() {
	const [values, setValues] = useState({
		name: '',
		email: '',
		birthDate: '',
		unit: '',
		phone: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { register, loading } = useAuthContext();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { name, email, birthDate, unit, phone, password, confirmPassword } = values;
		if (!name.trim() || !email.trim() || !birthDate.trim() || !unit.trim() || !phone.trim() || !password.trim()) {
			setError('Vui lòng điền đầy đủ thông tin');
			return;
		}
		if (password !== confirmPassword) {
			setError('Mật khẩu không khớp');
			return;
		}
		setError('');
		const res = await register({ name, email, password, birthDate, unit, phone });
		if (res?.message) {
			navigate('/login');
		} else {
			setError(res?.error || 'Đăng ký thất bại');
		}
	};

	return (
		<AuthForm title='Đăng kí' fields={fields} values={values} onChange={handleChange} onSubmit={handleSubmit} loading={loading} error={error} submitText='Đăng kí'>
			<p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--txt-secondary)', textAlign: 'center' }}>
				Đã có tài khoản?{' '}
				<Link to='/login' style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
					Đăng nhập
				</Link>
			</p>
		</AuthForm>
	);
}
