import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {loginSchema} from '@/utils/validation';
import prismaDB from "@/lib/prisma"; // adjust the import based on your validation setup

const requireToken = (handler: any) => {
    return async (req: NextRequest) => {
        return handler(req);
    };
};

export const POST = requireToken(async (req: NextRequest) => {
    try {
        const body = await req.json();
        const {email, password} = loginSchema.parse(body);

        const user = await prismaDB.user.findUnique({
            where: {email},
        });

        if (!user) {
            return new NextResponse(JSON.stringify({message: 'Invalid email or password'}), {status: 401});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return new NextResponse(JSON.stringify({message: 'Invalid email or password'}), {status: 401});
        }

        const token = jwt.sign(
            {userId: user.id, email: user.email},
            process.env.JWT_SECRET!,
            {expiresIn: '1h'}
        );
        const userUpdate = {
            countryId: user.countryId,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
        return new NextResponse(JSON.stringify({user: userUpdate, token}), {status: 200});
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify({message: error.errors.map(e => e.message).join(', ')}), {status: 400});
        }

        console.error(error);
        return new NextResponse(JSON.stringify({message: 'Internal server error'}), {status: 500});
    }
});
