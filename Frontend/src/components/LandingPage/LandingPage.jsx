import React from 'react';
import styles from './LandingPage.module.css';
import CardSwitcher from './CardSwitcher';
import Navbar from './NavBar';
import HeroSection from './HeroSection';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div className={styles.pageContent}>
        <section>
          <HeroSection />
        </section>
        <section>
          <CardSwitcher />
        </section>
      </div>
    </>
  );
};

export default LandingPage;