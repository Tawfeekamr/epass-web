'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Loading from "@/components/Loading";
import { BackgroundGradient } from "@/components/animation/BackgroundGradient";
import { Button } from "@/components/ui/button";
import {IUser} from "@/@types";

const UserPage: React.FC = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { username } = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            if (!username) return;

            try {
                const response = await axios.get(`/api/user/${username}`);
                setUser(response.data);
                setLoading(false);
            } catch (error: any) {
                console.error('Error fetching user data:', error);
                if (error.response && error.response.status === 401) {
                    router.push('/login');
                } else {
                    setError('Error loading user data');
                    setLoading(false);
                }
            }
        };

        fetchUser();
    }, [username, router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <BackgroundGradient>
                <div className="p-5 space-y-2">
                    <h1>Username: {user.username}</h1>
                    <p>Email: {user.email}</p>
                    <p>Country: {user.country?.name}</p>
                    <div className="pt-5">
                        <Button onClick={handleLogout} className="w-full">Logout</Button>
                    </div>
                </div>
            </BackgroundGradient>
        </div>
    );
};

export default UserPage;
