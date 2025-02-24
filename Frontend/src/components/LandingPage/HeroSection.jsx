import React from 'react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
    return (
        <section className={styles.hero}>
            <h2>Track Your Expenses with<p className={styles.highlight}>Ease</p></h2>
            <p>Manage your finances, track your spending, and save more!</p>
            <div className={styles.ctaButtons}>
                <button className={styles.loginBtn}>Login</button>
                <button className={styles.joinBtn}>Get Started</button>
            </div>
        </section>
    );
};

export default HeroSection;