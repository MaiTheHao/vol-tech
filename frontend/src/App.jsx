import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import APP_CONFIG from '../config';
import LocalStorageService, { LOCAL_STORAGE_KEYS } from './services/local-storage.service';

function App() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		const fetchUser = async () => {
			LocalStorageService.set(
				LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjU1MDdiZGFlMTI0OWU2ODFlOGIxZiIsImVtYWlsIjoiYW5oY2hhbmduaGFubWExNjdAZ21haWwuY29tIiwiaWF0IjoxNzU2NzE1NTIyLCJleHAiOjE3NTY4MDE5MjJ9.0vU3upcyFzXeg2e_iT4NlZhWxWEAVOl0NvZzBytWd9I'
			);
			const res = await fetch(`${APP_CONFIG.api.getFullPath('/user/me')}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${LocalStorageService.get(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)}`,
				},
			});
			const data = await res.json();
			console.log(data);
		};
		fetchUser();
	}, []);

	return (
		<>
			<div>
				<a href='https://vite.dev' target='_blank'>
					<img src={viteLogo} className='logo' alt='Vite logo' />
				</a>
				<a href='https://react.dev' target='_blank'>
					<img src={reactLogo} className='logo react' alt='React logo' />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className='card'>
				<button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
				<p>
					Edit <code>src/App.jsx</code> and save to test HMR
				</p>
			</div>
			<p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
		</>
	);
}

export default App;
