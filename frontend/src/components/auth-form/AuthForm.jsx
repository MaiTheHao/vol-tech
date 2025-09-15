import React, { useState } from 'react';
import Input from '../input/Input';
import styles from './AuthForm.module.scss';
import { Link } from 'react-router-dom';

const defaultFields = {
  login: [
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Nhập email', required: true },
    { name: 'password', label: 'Mật khẩu', type: 'password', placeholder: 'Nhập mật khẩu', required: true },
  ],
  register: [
    { name: 'name', label: 'Tên người dùng', type: 'text', placeholder: 'Nhập tên người dùng', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Nhập email', required: true },
    { name: 'password', label: 'Mật khẩu', type: 'password', placeholder: 'Nhập mật khẩu', required: true },
    { name: 'confirmPassword', label: 'Xác nhận mật khẩu', type: 'password', placeholder: 'Nhập lại mật khẩu', required: true },
  ],
};

function AuthForm({ mode = 'login', onSubmit }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const fields = defaultFields[mode];

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrors = {};

    fields.forEach(f => {
      if (f.required && !formData[f.name]?.trim()) {
        tempErrors[f.name] = `${f.label} không được để trống`;
      }
    });

    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (err) {
      setErrors({ general: err.message || 'Lỗi server' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <h1 className={styles.title}>
        {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
      </h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {fields.map(f => (
          <Input
            key={f.name}
            name={f.name}
            label={f.label}
            type={f.type}
            placeholder={f.placeholder}
            value={formData[f.name] || ''}
            onChange={e => handleChange(f.name, e.target.value)}
            error={errors[f.name]}
          />
        ))}

        {errors.general && <p className={styles.generalError}>{errors.general}</p>}

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
        </button>
      </form>

      <p className={styles.linkText}>
        {mode === 'login'
          ? <>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></>
          : <>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></>
        }
      </p>
    </div>
  );
}

export default AuthForm;
