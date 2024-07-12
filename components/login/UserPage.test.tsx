import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, it, vi } from 'vitest';
import axios from 'axios';
import UserPage from '../../app/user/[username]/page';
import { renderWithRouter } from './user-test-utils';
import '@testing-library/jest-dom';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockUserResponse = {
    data: {
        username: 'testuser',
        email: 'user@example.com',
        country: { name: 'United States' },
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
        mockedAxios.get.mockRejectedValue({ response: { status: 401 } });

        renderWithRouter(<UserPage />);

        await waitFor(() => {
            expect(mockUseRouter.push).toHaveBeenCalledWith('/login');
        });
    });

    it('shows error message if Error loading user data', async () => {
        mockedAxios.get.mockRejectedValue({ response: { status: 404 } });

        renderWithRouter(<UserPage />);

        await waitFor(() => {
            expect(screen.getByText('Error loading user data')).toBeInTheDocument();
        });
    });
});
