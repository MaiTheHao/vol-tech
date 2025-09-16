import React, { useEffect } from 'react';
import styles from './AuthForm.module.scss';
import Input from '../input/Input';
import Swal from 'sweetalert2';

const AuthForm = ({ title = '', fields = [], values = {}, onChange = () => {}, onSubmit = () => {}, loading = false, error = null, submitText = 'Xác nhận', children }) => {
	useEffect(() => {
		if (error) {
			Swal.fire({
				icon: 'error',
				title: 'Lỗi',
				text: error,
				confirmButtonText: 'Đóng',
			});
		}
	}, [error]);

	return (
		<div className={styles.card}>
			{title && <h1 className={styles.title}>{title}</h1>}
			<form className={styles.form} onSubmit={onSubmit}>
				{fields.map((f) => (
					<Input key={f.name} name={f.name} label={f.label} type={f.type} placeholder={f.placeholder} value={values[f.name] || ''} onChange={onChange} error={error && error.includes(f.name) ? error : ''} {...f.inputProps} />
				))}
				<button type='submit' disabled={loading} className={styles.submitBtn}>
					{loading ? 'Đang xử lý...' : submitText}
				</button>
			</form>
			{children}
		</div>
	);
};

export default AuthForm;
