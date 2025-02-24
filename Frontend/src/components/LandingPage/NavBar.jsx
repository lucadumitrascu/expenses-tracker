import React from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <h1>Expenses Tracker</h1>
            </div>
            <ul className={styles.navButtons}>
                <button className={styles.loginBtn}>Login</button>
                <button className={styles.joinBtn}>Join</button>
            </ul>
        </nav>
    );
};

export default Navbar;