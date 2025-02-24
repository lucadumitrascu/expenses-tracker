import React, { useState, useEffect } from 'react';
import styles from './CardSwitcher.module.css';

const cardsData = [
    {
        id: 1,
        title: 'Expense and Budget Management',
        content: "The ability to add and organize expenses, set budgets by category, and track them in a clear and intuitive way. This is essential for users who want to monitor their daily expenses, stay within budget, and receive alerts when they exceed their set limits."
    },
    {
        id: 2,
        title: 'App Security and Authentication (JWT, Google Login)',
        content: "Providing a secure authentication system using JWT tokens to protect user data, along with the option for Google Login to make the login process faster and more convenient. This will ensure users feel confident in the app's security and data protection."
    },
    {
        id: 3,
        title: 'Data Visualization with Charts',
        content: "Automatically generating charts based on user financial data to provide a clear and attractive visualization of expenses. This tool will help users analyze their spending behavior in an easy-to-understand way, enabling better financial decisions."
    },
    {
        id: 4,
        title: 'Family Mode and Shared Expense Groups',
        content: "Allowing users to manage common budgets within a group (e.g., family, friends, vacation) and track shared expenses. This feature addresses the need for users to manage finances collectively with family members or friends, keeping everyone on the same page."
    }
];

function CardSwitcher() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fadeClass, setFadeClass] = useState(styles.visible);
    const [intervalTime, setIntervalTime] = useState(3000);
    const [isClicked, setIsClicked] = useState();

    useEffect(() => {
        const interval = setInterval(() => {
            setFadeClass('');
            setTimeout(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % cardsData.length);
                setFadeClass(styles.visible);
            }, 500);
            setIntervalTime(3000);
        }, intervalTime);

        return () => clearInterval(interval);
    },);

    const handleLeftClick = () => {
        if (!isClicked) {
            setIsClicked(true);
            setIntervalTime(5000);
            setFadeClass('');
            setTimeout(() => {
                setCurrentIndex(prevIndex => (prevIndex - 1 + cardsData.length) % cardsData.length);
                setFadeClass(styles.visible);
            }, 500);
            setTimeout(() => { setIsClicked(false); }, 1000);
        }
    };

    const handleRightClick = () => {
        if (!isClicked) {
            setIsClicked(true);
            setIntervalTime(5000);
            setFadeClass('');
            setTimeout(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % cardsData.length);
                setFadeClass(styles.visible);
            }, 500);
            setTimeout(() => { setIsClicked(false); }, 1000);
        }
    };

    return (
        <div className={styles.cardContainer}>
            <button className={styles.buttonChangeCard} onClick={handleLeftClick}>
                <i className="fa fa-chevron-left"></i>
            </button>
            <div className={`${styles.transition} ${fadeClass}`}>
                <h2 className={styles.cardTitle}>{cardsData[currentIndex].title}</h2>
                <p>{cardsData[currentIndex].content}</p>
            </div>
            <button className={styles.buttonChangeCard} onClick={handleRightClick}>
                <i className="fa fa-chevron-right"></i>
            </button>
        </div>
    );
}

export default CardSwitcher;