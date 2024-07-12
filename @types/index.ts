export type TUserData = {
    country: string;
    email: string;
    username: string;
    password: string;
    message: string;
};


export interface ICountry {
    name: string;
}

export interface IUser {
    username: string;
    email: string;
    country?: ICountry;
}
