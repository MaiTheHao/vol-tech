import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import Register from './pages/register/register';
import Home from './pages/Home/home';
import Login from './pages/Login/login';

const App = () => {
	return (
			<Routes>
				<Route index element={<Home/>}/>
				<Route path="/home" element={<Home/>}/>
				<Route path='/login' element={<Login/>}/>
				{/* <Route path="/register" element={<Register/>}/> */}
			</Routes>
	);
}

export default App;
