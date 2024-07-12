'use client'

import LeftColumn from "@/components/LeftColumn";
import LoginScreen from "@/components/login/LoginScreen";
import React, {useState} from "react";
import styles from '../styles/LoginView.module.css';

export default function LoginView() {
    const [selectedCountry, setSelectedCountry] = useState<string>('US');

    const handleCountryChange = (country: string) => {
        setSelectedCountry(country);
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftColumn}>
                <LeftColumn selectedCountry={selectedCountry}/>
            </div>
            <div className={styles.rightColumn}>
                <LoginScreen onCountryChange={handleCountryChange}/>
            </div>
        </div>
    )
}


