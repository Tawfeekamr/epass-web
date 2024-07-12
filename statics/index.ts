import {TUserData} from "@/@types";

export const usersData: TUserData[] = [
    {
        country: 'UAE',
        email: 'user1@example.com',
        username: 'user123',
        password: 'password123',
        message: 'Username must be alphanumeric and at least 5 characters long'
    },
    {
        country: 'IN',
        email: 'user2@example.com',
        username: 'a123456',
        password: 'password123',
        message: 'Username must start with a letter and be at least 6 characters long'
    },
    {
        country: 'US',
        email: 'user3@example.com',
        username: 'a123456',
        password: 'password123',
        message: 'Username must be alphanumeric, can contain underscores, and be at least 6 characters long'
    },
    {
        country: 'DE',
        email: 'user4@example.com',
        username: 'a_user1',
        password: 'password123',
        message: 'Username must start with a letter, contain only alphanumeric characters or underscores, and be at least 6 characters long'
    },
];
