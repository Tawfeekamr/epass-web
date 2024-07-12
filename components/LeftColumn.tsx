'use client';
import React, {useEffect, useState} from 'react';
import {usersData} from "@/statics";
import {TUserData} from "@/@types";


interface LeftColumnProps {
    selectedCountry: string;
}

const LeftColumn: React.FC<LeftColumnProps> = ({selectedCountry}) => {
    const [userInfo, setUserInfo] = useState<TUserData | null>(null);

    useEffect(() => {
        const user = usersData.find(user => user.country === selectedCountry);
        console.debug('user', user)
        setUserInfo(user || null);
    }, [selectedCountry]);

    return (
        <div className="flex flex-col items-start justify-between lg:h-screen bg-black text-white p-8">
            <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                    <path fill="white"
                          d="M248 80a28 28 0 1 0-51.12 15.77l-26.79 33L146 73.4a28 28 0 1 0-36.06 0l-24.03 55.34l-26.79-33a28 28 0 1 0-26.6 12L47 194.63A16 16 0 0 0 62.78 208h130.44A16 16 0 0 0 209 194.63l14.47-86.85A28 28 0 0 0 248 80M128 40a12 12 0 1 1-12 12a12 12 0 0 1 12-12M24 80a12 12 0 1 1 12 12a12 12 0 0 1-12-12m196 12a12 12 0 1 1 12-12a12 12 0 0 1-12 12"/>
                </svg>
                <span className="font-bold text-lg">T.Amro</span>
            </div>
            {userInfo && (
                <div className="mt-2 lg:mt-auto">
                    <p className="text-[9px] lg:text-sm font-light"><u>Selected Country</u>: {userInfo.country}</p>
                    <p className="text-[9px] lg:text-sm font-light"><u>Email</u>: {userInfo.email}</p>
                    <p className="text-[9px] lg:text-sm font-light"><u>Username</u>: {userInfo.username}</p>
                    <p className="text-[9px] lg:text-sm font-light"><u>Password</u>: {userInfo.password}</p>
                    <p className="text-[9px] lg:text-sm font-light"><u>Role</u>: {userInfo.message}</p>
                </div>
            )}
        </div>
    );
};

export default LeftColumn;
