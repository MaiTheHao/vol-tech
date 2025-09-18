import Header from '../header/Header';
import Footer from '../footer/Footer';
import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.scss';

export default function MainLayout() {
  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.headerWrapper}>
        <Header />
      </div>
      <Outlet />
      <Footer />
    </div>
  );
}
