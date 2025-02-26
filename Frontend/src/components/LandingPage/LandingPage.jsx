import React from 'react';
import styles from './LandingPage.module.css';
import CardSwitcher from './CardSwitcher';
import Navbar from './NavBar';
import HeroSection from './HeroSection';

const LandingPage = () => {
  return (
    <div className={styles['landing-page-container']}>
      <Navbar />
      <div className={styles['page-content']}>
        <section>
          <HeroSection />
        </section>
        <section>
          <CardSwitcher />
        </section>
      </div>
    </div>
  );
};

export default LandingPage;