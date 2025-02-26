import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HeroSection.module.css';

const HeroSection = () => {

    const navigate = useNavigate();
    const handleGetStartedClick = () => {
        navigate('/authentication/register');
    };

    const handleLoginClick = () => {
        navigate('/authentication/login');
    };

    return (
        <section className={styles['hero']}>
            <h2>Track Your Expenses with<p className={styles['highlight']}>Ease</p></h2>
            <p>Manage your finances, track your spending, and save more!</p>
            <div className={styles['cta-buttons']}>
                <button className={styles['login-btn']} onClick={() => { handleLoginClick(); }}>Login</button>
                <button className={styles['join-btn']} onClick={() => { handleGetStartedClick(); }}>Get Started</button>
            </div>
        </section>
    );
};

export default HeroSection;