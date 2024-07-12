"use client";
import { TypewriterEffectSmooth } from "@/components/animation/typewriter-effect";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Typewriter() {
    const router = useRouter();
    const initialWords = [
        {
            text: "ePass App",
        },
        {
            text: "the awesome",
        },
        {
            text: "app",
        },
        {
            text: "ever",
        },
        {
            text: "build!.",
            className: "text-blue-500 dark:text-blue-500",
        },
    ];

    const signupWords = [
        {
            text: "You can",
        },
        {
            text: "Signup",
        },
        {
            text: "using the",
        },
        {
            text: "React Native",
        },
        {
            text: "app!",
            className: "text-blue-500 dark:text-blue-500",
        },
    ];

    const [words, setWords] = useState(initialWords);
    const [key, setKey] = useState(0); // Add a key state to force re-render

    const handleLoginClick = () => {
        if (router) {
            router.push("/login");
        }
    };

    const handleSignupClick = () => {
        setWords(signupWords);
        setKey((prevKey) => prevKey + 1);

        setTimeout(() => {
            setWords(initialWords);
            setKey((prevKey) => prevKey + 1);
        }, 1 * 60 * 1000);
    };

    return (
        <div className="flex flex-col items-center justify-center h-[40rem]">
            <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
                Tawfiq Amro FE Task (twamro@gmail.com)
            </p>
            <TypewriterEffectSmooth key={key} words={words} />
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
                <button
                    className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm"
                    onClick={handleLoginClick}
                >
                    Login
                </button>
                <button
                    className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm"
                    onClick={handleSignupClick}
                >
                    Signup
                </button>
            </div>
        </div>
    );
}
