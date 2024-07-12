import { vi } from "vitest";
import axios from 'axios';

function createMocks() {
    const mocks = {
        get: vi.fn(),
        post: vi.fn(),
    };

    vi.mock('axios', async () => {
        const actual = await vi.importActual<typeof import('axios')>('axios');
        return {
            ...actual,
            default: {
                ...actual.default,
                create: vi.fn(() => ({
                    ...actual.default.create(),
                    get: mocks.get,
                    post: mocks.post,
                })),
            },
        };
    });

    return mocks;
}

const mockedAxios = createMocks();

export { mockedAxios };
