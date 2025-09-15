import Header from "../header/Header";
import Footer from "../footer/footer";
import PropTypes from "prop-types";
import styles from "./MainLayout.module.scss";

export default function MainLayout({ children, isLoggedIn, user }) {
  return (
    <div className={styles.AppLayout}>
      <div className={styles.headerWrapper}>
        <Header isLoggedIn={isLoggedIn} user={user} />
      </div>
      <main className={styles.mainContent}>{children}</main>
      <div className={styles.footerWrapper}>
        <Footer />
      </div>
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    points: PropTypes.number,
  }),
};
