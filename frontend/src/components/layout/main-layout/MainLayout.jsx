import Header from '../header/Header';
import Footer from '../footer/Footer';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
	return (
		<>
			<Header />
			<Outlet />
			<Footer />
		</>
	);
}
