import {z} from "zod";
import {TApiError} from "@/@types/login";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const formLoginSchema = z.object({
    email: z.string().min(1, {message: "Email is required"}).email({message: "Invalid email address"}),
    password: z.string().min(1, {message: "Password is required"}).min(6, {message: "Password must be at least 6 characters long"}),
});

export type LoginFormInputs = z.infer<typeof formLoginSchema> & {
    apiError?: TApiError;
};

export const uaeSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
    username: z.string().regex(/^[a-zA-Z0-9]{5,}$/, {message: 'Username must be alphanumeric and at least 5 characters long'}),
    country: z.literal('UAE'),
});

export const indiaSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
    username: z.string().regex(/^[a-zA-Z][a-zA-Z0-9]{5,}$/, {message: 'Username must start with a letter and be at least 6 characters long'}),
    country: z.literal('IN'),
});

export const usSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
    username: z.string().regex(/^[a-zA-Z0-9_]{6,}$/, {message: 'Username must be alphanumeric, can contain underscores, and be at least 6 characters long'}),
    country: z.literal('US'),
});


export const deSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
    username: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]{5,}$/, {message: 'Username must start with a letter, contain only alphanumeric characters or underscores, and be at least 6 characters long'}),
    country: z.literal('DE'),
});

export const defaultSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
    username: z.string().min(5, {message: 'Username must be at least 5 characters long'}),
    country: z.string(),
});

export const getValidationSchema = (countryCode: string) => {
    switch (countryCode) {
        case 'UAE':
            return uaeSchema;
        case 'IN':
            return indiaSchema;
        case 'US':
            return usSchema;
        case 'DE':
            return deSchema;
        default:
            return defaultSchema;
    }
};
