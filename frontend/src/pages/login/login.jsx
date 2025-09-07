import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.scss';
import { login } from '../../services/api/v1/auth-api.service';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (err) {
      setError(err.message || "Login thất bại");
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
            <div className={styles.input}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.input}>
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className={styles.submit}>
              <button type="submit" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </form>
          <p className={styles.registerText}>
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
