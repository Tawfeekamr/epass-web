
# ePass App - by Tawifq Amro

ePass App is a web application designed to manage user authentication with country-specific username validation rules.
This document provides instructions on how to set up the project using Docker, seed the database with initial data, and
details the login components and routing.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
    - [Running the Application](#running-the-application)
    - [Seeding the Database](#seeding-the-database)
3. [Login Components](#login-components)
4. [Routing](#routing)
5. [Testing](#testing)
6. [Type Naming Conventions](#type-naming-conventions)
7. [Main Helpers](#main-helpers)
8. [Architecture](#architecture)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/) (if you need to run scripts locally)

## Setup

### Running the Application

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-repo/epass-app.git
   cd epass-app
   ```

2. **Build and Run Docker Containers**

   **Ensure Docker is running on your machine**. Then, build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```

   This command will build the Docker images and start the containers defined in `docker-compose.yml`.

3. **Access the Application**

   Once the containers are up and running, you can access the application
   at [http://localhost:3000](http://localhost:3000).

### Seeding the Database

To seed the database with initial data, follow these steps:

1. **Access the Container**

   Open a terminal and access the Docker container running the application:

   ```bash
   docker-compose exec app sh
   ```

2. **Run the Seed Script**

   Inside the container, run the seed script to populate the database:

   ```bash
   npm run seed
   ```

   This script will create initial entries for locales, countries, username rules, and users.

## Login Components

The login functionality is implemented using several components and hooks:

1. **LoginScreen Component**

   The `LoginScreen` component handles user login. It fetches country data, validates the login form based on selected
   country rules, and submits login credentials.

2. **LeftColumn Component**

   The `LeftColumn` component displays information about the selected country, including example email, username, and
   password based on predefined data.

3. **LoginView Component**

   The `LoginView` component combines `LoginScreen` and `LeftColumn` components to create the login view with responsive
   layout adjustments.

## Routing

The application uses Next.js for routing. Here's an overview of the routes:

1. **Home Route (`/`)**

   The home route checks for an existing token. If a token is found, the user is redirected to the `/user/[username]`
   route. If no token is found, the `LoginView` component is rendered.

   ```tsx
   'use client';
   import React, { useEffect } from "react";
   import { useRouter } from "next/navigation";
   import Head from "next/head";
   import LoginView from "@/views/loginView";

   const Page: React.FC = () => {
       const router = useRouter();

       useEffect(() => {
           const token = localStorage.getItem('token');
           if (token) {
               const username = localStorage.getItem('username');
               if (username) {
                   router.push(`/user/${username}`);
               }
           }
       }, [router]);

       return (
           <div>
               <Head>
                   <title>Home - ePass App</title>
               </Head>
               <LoginView />
           </div>
       )
   }

   export default Page;
   ```

2. **User Route (`/user/[username]`)**

   The user route fetches user data based on the username provided in the URL and displays the user information.

   ```tsx
   'use client'
   import React, { useEffect, useState } from 'react';
   import axios from 'axios';
   import { useRouter, useParams } from 'next/navigation';
   import Loading from "@/components/Loading";
   import { BackgroundGradient } from "@/components/animation/BackgroundGradient";
   import { Button } from "@/components/ui/button";

   const UserPage: React.FC = () => {
       const [user, setUser] = useState<IUser | null>(null);
       const [loading, setLoading] = useState<boolean>(true);
       const [error, setError] = useState<string | null>(null);
       const params = useParams();
       const router = useRouter();

       useEffect(() => {
           const fetchUser = async () => {
               if (!params || !params.username) return;

               try {
                   const response = await axios.get(`/api/user/${params.username}`);
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
       }, [params, router]);

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
                       <h1><b>Username</b>: {user.username}</h1>
                       <p><b>Email</b>: {user.email}</p>
                       <p><b>Country</b>: {user.country?.name}</p>
                       <div className={'pt-5'}>
                           <Button onClick={handleLogout} className="w-full">Logout</Button>
                       </div>
                   </div>
               </BackgroundGradient>
           </div>
       );
   };

   export default UserPage;
   ```

3. **API Routes**

   - **`/api/country`**: Fetches country data.
   - **`/api/user/me`**: Handles user login and token generation.
   - **`/api/user/[username]`**: Fetches user data based on username.

## Testing

### Tests for UserPage Component

The tests for the `UserPage` component check if user data is rendered correctly, if logout functionality works, and if unauthorized access redirects to the login page.

```typescript
import React from 'react';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import {beforeEach, describe, it, vi} from 'vitest';
import axios from 'axios';
import UserPage from '../../app/user/[username]/page';
import {renderWithRouter} from './user-test-utils';
import '@testing-library/jest-dom';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockUserResponse = {
    data: {
        username: 'testuser',
        email: 'user@example.com',
        country: {name: 'United States'},
    },
};

const mockUseRouter = {
    push: vi.fn(),
};

const mockUseParams = {
    username: 'testuser',
};

vi.mock('next/navigation', async () => {
    const actual = await vi.importActual('next/navigation');
    return {
        ...actual,
        useRouter: () => mockUseRouter,
        useParams: () => mockUseParams,
    };
});

describe('UserPage', () => {
    beforeEach(() => {
        mockedAxios.get.mockResolvedValue(mockUserResponse);
        mockUseRouter.push.mockClear();
    });

    it('renders user data and handles logout', async () => {
        renderWithRouter(<UserPage />);

        await waitFor(() => {
            expect(screen.getByText('Username: testuser')).toBeInTheDocument();
        });

        expect(screen.getByText('Email: user@example.com')).toBeInTheDocument();
        expect(screen.getByText('Country: United States')).toBeInTheDocument();

        const logoutButton = screen.getByText('Logout');
        expect(logoutButton).toBeInTheDocument();

        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(mockUseRouter.push).toHaveBeenCalledWith('/login');
        });

        expect(localStorage.getItem('token')).toBeNull();
    });

    it('redirects to login if unauthorized', async () => {
        mockedAxios.get.mockRejectedValue({response: {status: 401}});

        renderWithRouter(<UserPage />);

        await waitFor(() => {
            expect(mockUseRouter.push).toHaveBeenCalledWith('/login');
        });
    });

    it('shows error message if user not found', async () => {
        mockedAxios.get.mockRejectedValue({response: {status: 404}});

        renderWithRouter(<UserPage />);

        await waitFor(() => {
            expect(screen.getByText('User not

 found')).toBeInTheDocument();
        });
    });
});
```

## Type Naming Conventions

- **TType**: Represents a type, typically used for defining data structures or types.
- **IInterface**: Represents an interface, typically used for defining contracts for classes or objects.

### Example

```typescript
// Type definition
type TUser = {
    id: string;
    username: string;
    email: string;
};

// Interface definition
interface IUserService {
    getUser(id: string): Promise<TUser>;
}
```

## Main Helpers

### `axiosConfig`

A helper to create a configured Axios instance for making API requests.

```typescript
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
```

### `jwtverify`

A helper for verifying JWT tokens.

```typescript
import { jwtVerify } from 'jose';

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        return payload;
    } catch (error) {
        throw new Error('Invalid token');
    }
}
```

## Architecture

### Components

- **LoginScreen**: Handles the login form, including validation and submission.
- **LeftColumn**: Displays example data based on the selected country.
- **LoginView**: Combines `LoginScreen` and `LeftColumn` with responsive design.

### Pages

- **Home Page (`/`)**: Checks for an existing token and either redirects to the user page or displays the login view.
- **User Page (`/user/[username]`)**: Fetches and displays user data, includes logout functionality.

### API Routes

- **`/api/country`**: Fetches available countries.
- **`/api/user/me`**: Handles user login and returns a JWT token.
- **`/api/user/[username]`**: Fetches user data based on the username.

## Conclusion

This README provides a comprehensive guide to setting up and running the ePass App, including instructions on running
the application with Docker, seeding the database, understanding the login components, and the routing structure. For
any further questions or issues, please refer to the documentation or contact the project maintainers.
```

This README file covers the essentials of setting up, running, and understanding the ePass App project, including instructions for running the application with Docker, seeding the database, understanding the login components, routing, and testing. It also includes the type naming conventions and main helpers used in the application.
