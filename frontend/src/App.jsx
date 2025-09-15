import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/mainlayout/Mainlayout';
import  Header  from './components/layout/header/Header';
import Login from './pages/login/Login';
import Register from './pages/register/register';
import HomePage from './components/pages';

const App = () => {
	return (
		<Routes>
			<Route index element={<HomePage/>} />
			<Route path='/home' element={<HomePage/>} />
			<Route path='/login' element={<Login />} />
			<Route path="/register" element={<Register/>}/>
		</Routes>
	);
};

export default App;
