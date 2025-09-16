import Header from '../header/Header';
import Footer from '../footer/Footer';
import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.scss';

export default function MainLayout() {
	return (
		<div className={styles.AppLayout}>
			<div className={styles.headerWrapper}>
				<Header />
			</div>
			<main className={styles.mainContent}>
				<Outlet />
			</main>
			<div className={styles.footerWrapper}>
				<Footer />
			</div>
		</div>
	);
}
