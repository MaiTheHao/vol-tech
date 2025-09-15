import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/mainlayout/Mainlayout';
import  Header  from './components/layout/header/Header';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/register';

const App = () => {
	return (
		<Routes>
			<Route index element={<MainLayout/>} />
			<Route path='/home' element={<Header />} />
			<Route path='/login' element={<Login />} />
			<Route path="/register" element={<Register/>}/>
		</Routes>
	);
};

export default App;
