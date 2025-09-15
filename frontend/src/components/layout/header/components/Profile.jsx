import { NavLink, Link } from 'react-router-dom'
import styles from '../header.module.scss'



export function AvatarLink({ avatarSrc, altText,  }) {
    return (
        <Link to="/Profile" className={styles.avatarLink}>
                <img src={avatarSrc} alt={altText}/>
        </Link>
        
    );
}

export function PointLink({ pointSrc, pointText }) {
    return (
        <NavLink
                to="/Profile" className={styles.rank}>
                    <div>1112</div> 
                    <div>
                        <img src={pointSrc} alt={pointText}/>
                    </div>
        </NavLink>
    )
}

export default function UsernameLink() {
    return (
        <NavLink 
            to="/Profile"
            className={({ isActive }) =>
                    isActive ? `${styles.usernameLink} ${styles.active}` : styles.usernameLink 
            } 
        >                                
            Nguyễn Văn N      
        </NavLink>
    );
}


