import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/main-layout/MainLayout.jsx';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from './pages/home/Home.jsx';
import AuthContextProvider from './contexts/auth/AuthContextProvider.jsx';
import { ROUTES } from './const/index.js';
import AlignCenterLayout from './components/layout/align-center-layout/AlignCenterLayout.jsx';

const App = () => {
	return (
		<AuthContextProvider>
			<Routes>
				<Route element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path={ROUTES.HOME.path} element={<Home />} />
				</Route>
				<Route element={<AlignCenterLayout />}>
					<Route path={ROUTES.LOGIN.path} element={<Login />} />
					<Route path={ROUTES.REGISTER.path} element={<Register />} />
				</Route>
			</Routes>
		</AuthContextProvider>
	);
};

export default App;
