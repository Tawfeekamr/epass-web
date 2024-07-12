import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import {validateGuestToken} from "@/utils/tokenCheck";

export const requireGuestToken = (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const guestToken = req.headers['x-guest-token'];

        if (!guestToken) {
            return res.status(401).json({ message: 'Guest token is required' });
        }

        const isValid = validateGuestToken(guestToken as string);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid guest token' });
        }
        return handler(req, res);
    };
};

