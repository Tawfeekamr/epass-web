'use client';
import React, {useEffect, useState} from 'react';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {getValidationSchema} from '@/utils/validation';
import MeteorEffect from '@/components/animation/MeteorEffect';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {TCountry, TLoginFormInputs} from '@/@types/login';
import {Label} from '@/components/ui/label';
import {useTheme} from '@/theme/useTheme';
import {Icon} from '@iconify/react';
import sunIcon from '@iconify/icons-mdi/weather-sunny';
import moonIcon from '@iconify/icons-mdi/weather-night';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import Loading from "@/components/Loading";
import axios from "axios";

const LoginScreen: React.FC<{ onCountryChange: (country: string) => void }> = ({onCountryChange}) => {
    const {theme, toggleTheme} = useTheme();
    const [countries, setCountries] = useState<TCountry[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const router = useRouter();

    const [validationSchema, setValidationSchema] = useState(getValidationSchema(''));

    const methods = useForm<TLoginFormInputs>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            country: '',
        }
    });

    const {register, handleSubmit, formState: {errors}, setError, setValue, reset} = methods;

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('/api/country');
                setCountries(response.data);

                setTimeout(() => {
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error('Error fetching countries', error);
                setFetchError('Error loading countries');
                setIsLoading(false);
            }
        };

        fetchCountries();
    }, [setValue, onCountryChange]);

    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then((permission) => {
                if (permission !== 'granted') {
                    console.log('Notification permission denied');
                }
            });
        }
    }, []);

    useEffect(() => {
        reset({
            country: selectedCountry,
        });
    }, [selectedCountry, reset]);

    const showNotification = (title: string, body: string) => {
        if (Notification.permission === 'granted') {
            new Notification(title, {body});
        } else {
            console.warn('Notification permission not granted');
        }
    };

    const onSubmit: SubmitHandler<TLoginFormInputs> = async (data) => {
        try {
            setError('apiError', {message: ''});

            const response = await axios.post('/api/user/me', data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                showNotification('Login Successful', 'You have successfully logged in.');
                router.push(`/user/${response.data.user.username}`);
            }
        } catch (error) {
            console.error('Login error', error);
            showNotification('Login Failed', 'An error occurred during login. Please try again.');

            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || 'An unknown error occurred. Please try again.';
                setError('apiError', {message: errorMessage});
            }
        }
    };

    const handleCountryChange = (value: string) => {
        setSelectedCountry(value);
        setValidationSchema(getValidationSchema(value));
        setValue('country', value);
        onCountryChange(value);
        console.debug('country', value);
    };

    if (isLoading) {
        return <Loading/>;
    }

    if (fetchError) {
        return <div>{fetchError}</div>;
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <MeteorEffect/>
            <Button onClick={() => {
                toggleTheme();
                showNotification('Theme Changed', `The theme has been changed to ${theme === 'light' ? 'dark' : 'light'} mode.`);
            }} className="absolute top-4 right-4">
                {theme === 'light' ? (
                    <Icon icon={sunIcon} className="w-6 h-6"/>
                ) : (
                    <Icon icon={moonIcon} className="w-6 h-6"/>
                )}
            </Button>
            <Card className="relative z-10 w-full max-w-sm p-6 space-y-4 bg-white shadow-lg dark:bg-[#121212]">
                <CardHeader>
                    <CardTitle className="text-black dark:text-white">Login</CardTitle>
                    <CardDescription className="text-gray-700 dark:text-gray-300">
                        Enter your email below to login to your account.
                    </CardDescription>
                </CardHeader>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="country" className="text-black dark:text-white">Country</Label>
                                <Select onValueChange={handleCountryChange}>
                                    <SelectTrigger
                                        className="w-full px-3 py-2 text-black dark:text-white dark:bg-gray-800 rounded-md">
                                        <SelectValue placeholder="Select a country"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem
                                                key={country.id}
                                                value={country.code}
                                            >
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.country &&
                                    <span className="text-red-500 text-[10px]">{errors.country.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-black dark:text-white">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register('email')}
                                    className="w-full px-3 py-2 text-black dark:text-white dark:bg-gray-800 rounded-md"
                                />
                                {errors.email &&
                                    <span className="text-red-500 text-[10px]">{errors.email.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username" className="text-black dark:text-white">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    {...register('username')}
                                    className="w-full px-3 py-2 text-black dark:text-white dark:bg-gray-800 rounded-md"
                                />
                                {errors.username &&
                                    <span className="text-red-500 text-[10px]">{errors.username.message}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-black dark:text-white">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    placeholder={'Password'}
                                    name="password"
                                    className="w-full px-3 py-2 text-black dark:text-white dark:bg-gray-800 rounded-md"
                                />
                                {errors.password && <span data-testid="api-error"
                                                          className="text-red-500 text-[10px]">{errors.password.message}</span>}
                            </div>
                            {errors.apiError && (
                                <div data-testid="api-error"
                                     className="text-red-500 text-[10px]">{errors.apiError.message}</div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full text-white dark:bg-black">Sign in</Button>
                        </CardFooter>
                    </form>
                </FormProvider>
            </Card>
        </div>
    );
};

export default LoginScreen;
