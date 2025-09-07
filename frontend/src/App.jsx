import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';

const App = () => {
	return (
		<Routes>
			<Route index element={<Home />} />
			<Route path='/home' element={<Home />} />
			<Route path='/login' element={<Login />} />
			{/* <Route path="/register" element={<Register/>}/> */}
		</Routes>
	);
};

export default App;
