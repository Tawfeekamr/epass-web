import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach } from 'vitest';
import UserPage from '../../app/user/[username]/page';
import { renderWithRouter } from './user-test-utils';
import '@testing-library/jest-dom';
import {mockedAxios} from "@/utils/mockAxios";

const mockUserResponse = {
    data: {
        username: 'testuser',
        email: 'user@example.com',
        country: { name: 'United States' },
    },
};

describe('UserPage', () => {
    beforeEach(() => {
        mockedAxios.get.mockResolvedValue(mockUserResponse);
    });

    it('renders user data and handles logout', async () => {
        const push = vi.fn();

        renderWithRouter(<UserPage />, {
            push,
            query: { username: 'testuser' },
        });

        await waitFor(() => {
            expect(screen.getByText('Username: testuser')).toBeInTheDocument();
        });

        expect(screen.getByText('Email: user@example.com')).toBeInTheDocument();
        expect(screen.getByText('Country: United States')).toBeInTheDocument();

        const logoutButton = screen.getByText('Logout');
        expect(logoutButton).toBeInTheDocument();

        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/login');
        });

        expect(localStorage.getItem('token')).toBeNull();
    });

    it('redirects to login if unauthorized', async () => {
        mockedAxios.get.mockRejectedValue({ response: { status: 401 } });

        const push = vi.fn();

        renderWithRouter(<UserPage />, {
            push,
            query: { username: 'testuser' },
        });

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/login');
        });
    });

    it('shows error message if user not found', async () => {
        mockedAxios.get.mockRejectedValue({ response: { status: 404 } });

        renderWithRouter(<UserPage />, {
            query: { username: 'nonexistentuser' },
        });

        await waitFor(() => {
            expect(screen.getByText('User not found')).toBeInTheDocument();
        });
    });
});
