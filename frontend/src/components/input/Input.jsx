import React, { useMemo } from 'react';
import styles from './Input.module.scss';

function Input({ name = 'Name', label = 'Label', type = 'text', placeholder = 'Placeholder', value, onChange, error = 'FUCK YOUR ERROR MESSAGE', ...rest }) {
	const id = useMemo(() => `${label}-${placeholder}-${name}`, [label, placeholder, name]);

	return (
		<div className={`${styles.container} ${error ? styles.inputError : ''}`}>
			<label className={styles.label} htmlFor={id}>
				{label}
			</label>
			<label className={`${styles.input}`} htmlFor={id}>
				<input type={type} placeholder={placeholder} id={id} value={value} onChange={onChange} {...rest} />
			</label>
			<span className={styles.error}>{error}</span>
		</div>
	);
}

export default Input;
