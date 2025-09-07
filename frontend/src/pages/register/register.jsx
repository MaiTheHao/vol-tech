import React from 'react';
import { Link } from 'react-router-dom'
import styles from './login.module.scss'


const Register = () => {
    return (
        <div className={styles.RegisterPage}>
            <div className={styles.Container}>
                <div className={styles.Content}>
                    <Link to="/register">
                        <span className={styles.Title}>Đăng kí</span>
                    </Link>                    
                </div>
            </div>
        </div>
    );
}

export default Register;

