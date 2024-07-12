import React, {ReactElement} from 'react';
import {AppRouterContext, AppRouterInstance,} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {render} from '@testing-library/react';
import {vi} from 'vitest';

export type AppRouterContextProviderMockProps = {
    router: Partial<AppRouterInstance>;
    children: React.ReactNode;
};

export const AppRouterContextProviderMock = ({
                                                 router,
                                                 children,
                                             }: AppRouterContextProviderMockProps): React.ReactNode => {
    const mockedRouter: AppRouterInstance = {
        back: vi.fn(),
        forward: vi.fn(),
        push: vi.fn(),
        replace: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
        ...router,
    };
    return (
        <AppRouterContext.Provider value={mockedRouter}>
            {children}
        </AppRouterContext.Provider>
    );
};

export const renderWithRouter = (ui: ReactElement, router: Partial<AppRouterInstance> = {}) => {
    return render(
        <AppRouterContextProviderMock router={router}>
            {ui}
        </AppRouterContextProviderMock>
    );
};
