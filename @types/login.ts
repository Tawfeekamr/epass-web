import {z} from "zod";
import {defaultSchema, deSchema, indiaSchema, uaeSchema, usSchema} from '@/utils/validation';

export type TLoginData = {
    token?: string;
    message?: string;
};


export type TApiError = {
    field: string;
    message: string;
};


export type TCountry = {
    id: number;
    name: string;
    code: string;
    usernameRule?: {
        regex: string;
        message: string;
    };
};


type UAEInputs = z.infer<typeof uaeSchema>;
type IndiaInputs = z.infer<typeof indiaSchema>;
type USInputs = z.infer<typeof usSchema>;
type DEInputs = z.infer<typeof deSchema>;
type DefaultInputs = z.infer<typeof defaultSchema>;

export type TLoginFormInputs = (UAEInputs | IndiaInputs | USInputs | DEInputs | DefaultInputs) & {
    apiError?: string;
};
