
```markdown
# ePass App

ePass App is a web application designed to manage user authentication with country-specific username validation rules. This document provides instructions on how to set up the project using Docker, seed the database with initial data, and details the login components and routing.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
    - [Running the Application](#running-the-application)
    - [Seeding the Database](#seeding-the-database)
3. [Login Components](#login-components)
4. [Routing](#routing)

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

   **[[ Ensure Docker is running on your machine ]]**. Then, build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```

   This command will build the Docker images and start the containers defined in `docker-compose.yml`.

3. **Access the Application**

   Once the containers are up and running, you can access the application at [http://localhost:3000](http://localhost:3000).

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

   The `LoginScreen` component handles user login. It fetches country data, validates the login form based on selected country rules, and submits login credentials.

2. **LeftColumn Component**

   The `LeftColumn` component displays information about the selected country, including example email, username, and password based on predefined data.

3. **LoginView Component**

   The `LoginView` component combines `LoginScreen` and `LeftColumn` components to create the login view with responsive layout adjustments.

## Routing

The application uses Next.js for routing. Here's an overview of the routes:

1. **Home Route (`/`)**

   The home route checks for an existing token. If a token is found, the user is redirected to the `/user/[username]` route. If no token is found, the `LoginView` component is rendered.

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
   import { useRouter } from 'next/navigation';
   import Loading from "@/components/Loading";

   const UserPage: React.FC = () => {
       const [user, setUser] = useState<any>(null);
       const [loading, setLoading] = useState<boolean>(true);
       const [error, setError] = useState<string | null>(null);
       const router = useRouter();
       const { username } = router.query;

       useEffect(() => {
           const fetchUser = async () => {
               if (!username) return;

               try {
                   const response = await axios.get(`/api/user/${username}`);
                   setUser(response.data);
                   setLoading(false);
               } catch (error) {
                   console.error('Error fetching user data:', error);
                   setError('Error loading user data');
                   setLoading(false);
               }
           };

           fetchUser();
       }, [username]);

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
           <div>
               <h1>{user.username}</h1>
               <p>Email: {user.email}</p>
               <p>Country: {user.country.name}</p>
           </div>
       );
   };

   export default UserPage;
   ```

3. **API Routes**

    - **`/api/country`**: Fetches country data.
    - **`/api/user/me`**: Handles user login and token generation.
    - **`/api/user/[username]`**: Fetches user data based on username.

## Conclusion

This README provides a comprehensive guide to setting up and running the ePass App, including instructions on running the application with Docker, seeding the database, understanding the login components, and the routing structure. For any further questions or issues, please refer to the documentation or contact the project maintainers.
```

This README file covers the essentials of setting up, running, and understanding the ePass App project. It provides clear instructions and examples to help developers get started quickly.
