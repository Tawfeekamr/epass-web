import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { AppRouterContextProviderMock, renderWithRouter } from './login-test-utils';
import LoginScreen from '@/components/login/LoginScreen';
import '@testing-library/jest-dom';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockCountriesResponse = {
    data: [
        { id: 1, name: 'United Arab Emirates', code: 'UAE' },
        { id: 2, name: 'India', code: 'IN' },
        { id: 3, name: 'United States', code: 'US' },
        { id: 4, name: 'Germany', code: 'DE' },
    ],
};

const mockLoginResponse = {
    data: {
        token: 'test-token',
        user: {
            username: 'testuser',
        },
    },
};

describe('LoginScreen', () => {
    beforeEach(() => {
        mockedAxios.get.mockResolvedValue(mockCountriesResponse);
    });

    it('renders login form and fetches countries', async () => {
        renderWithRouter(<LoginScreen onCountryChange={() => {}} />);

        await waitFor(() => {
            expect(screen.getByText('Select a country')).toBeInTheDocument();
        });

        expect(screen.getByPlaceholderText('m@example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });

    it('handles country selection and form submission', async () => {
        const push = vi.fn();
        render(<AppRouterContextProviderMock router={{ push }}><LoginScreen onCountryChange={() => {}} /></AppRouterContextProviderMock>);

        await waitFor(() => {
            expect(screen.getByText('Select a country')).toBeInTheDocument();
        });

        fireEvent.mouseDown(screen.getByText('Select a country'));
        fireEvent.click(screen.getByText('India'));
        fireEvent.change(screen.getByPlaceholderText('m@example.com'), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

        mockedAxios.post.mockResolvedValue(mockLoginResponse);

        fireEvent.click(screen.getByText('Sign in'));

        await waitFor(() => {
            expect(push).toHaveBeenCalledWith('/user/testuser');
        });

        expect(localStorage.getItem('token')).toBe('test-token');
    });

    it('shows error message on login failure', async () => {
        renderWithRouter(<LoginScreen onCountryChange={() => {}} />);

        await waitFor(() => {
            expect(screen.getByText('Select a country')).toBeInTheDocument();
        });

        fireEvent.mouseDown(screen.getByText('Select a country'));
        fireEvent.click(screen.getByText('India'));
        fireEvent.change(screen.getByPlaceholderText('m@example.com'), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

        mockedAxios.post.mockRejectedValue({
            response: {
                data: {
                    message: "Invalid email or password"
                },
            },
        });

        fireEvent.click(screen.getByText('Sign in'));

        await waitFor(() => {
            const apiErrorElement = screen.getByTestId('api-error');
            expect(apiErrorElement).toBeInTheDocument();
            expect(apiErrorElement).toHaveTextContent('');
        });
    });
});
