import React, { useState, useEffect, useCallback } from 'react';
import AuthContext from './AuthContext.jsx';
import LocalStorageService, { LOCAL_STORAGE_KEYS } from '../../services/storage/local-storage.service.js';
import { login as loginApi, register as registerApi, logout as logoutApi, refreshToken as refreshTokenApi } from '../../services/api/v1/auth-api.service.js';
import { getMe } from '../../services/api/v1/user-api.service.js';

const AuthContextProvider = ({ children }) => {
	const [token, setTokenState] = useState(() => LocalStorageService.get(LOCAL_STORAGE_KEYS.ACCESS_TOKEN));
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);

	const setToken = useCallback((value) => {
		setTokenState(value);
		if (value) {
			LocalStorageService.set(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, value);
		} else {
			LocalStorageService.remove(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
		}
	}, []);

	const fetchUser = useCallback(async (tk) => {
		if (!tk) {
			setUser(null);
			return;
		}
		setLoading(true);
		try {
			const res = await getMe(tk);
			setUser(res || null);
		} catch {
			setUser(null);
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		if (token) {
			fetchUser(token);
		} else {
			const tk = LocalStorageService.get(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
			if (tk) setToken(tk);
			else setUser(null);
		}
	}, [token, fetchUser, setToken]);

	const login = useCallback(
		async (email, password) => {
			setLoading(true);
			const res = await loginApi(email, password);
			if (res?.accessToken) {
				setToken(res.accessToken);
				await fetchUser(res.accessToken);
				setLoading(false);
				return true;
			}
			setLoading(false);
			return false;
		},
		[setToken, fetchUser]
	);

	const register = useCallback(async (data) => {
		setLoading(true);
		const res = await registerApi(data);
		setLoading(false);
		return res;
	}, []);

	const logout = useCallback(async () => {
		setLoading(true);
		await logoutApi();
		setToken(null);
		setUser(null);
		setLoading(false);
	}, [setToken]);

	const refreshToken = useCallback(async () => {
		setLoading(true);
		const res = await refreshTokenApi();
		if (res?.accessToken) {
			setToken(res.accessToken);
			await fetchUser(res.accessToken);
			setLoading(false);
			return true;
		}
		setLoading(false);
		return false;
	}, [setToken, fetchUser]);

	const value = {
		token,
		user,
		loading,
		isAuth: !!token,
		setToken,
		setUser,
		login,
		register,
		logout,
		refreshToken,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
