import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {

    const navigate = useNavigate();
    const handleJoinClick = () => {
        navigate('/authentication/register');
    };

    const handleLoginClick = () => {
        navigate('/authentication/login');
    };

    return (
        <nav className={styles['landing-page-navbar']}>
            <div className={styles['logo']}>
                <h1>Expenses Tracker</h1>
            </div>
            <ul className={styles['nav-buttons']}>
                <button className={styles['login-btn']} onClick={() => { handleLoginClick(); }}>Login</button>
                <button className={styles['join-btn']} onClick={() => { handleJoinClick(); }}>Join</button>
            </ul>
        </nav>
    );
};

export default Navbar;