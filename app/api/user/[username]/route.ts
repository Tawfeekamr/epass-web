import { NextRequest, NextResponse } from 'next/server';
import prismaDB from '@/lib/prisma';
import { verifyToken } from '@/utils/jwtverify';

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
    const { username } = params;
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await verifyToken(token);

        if (!username) {
            return NextResponse.json({ message: 'Username is required' }, { status: 400 });
        }

        const user = await prismaDB.user.findUnique({
            where: {
                username,
            },
            include: {
                country: true,
            },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const userUpdate = {
            country: user.country,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return NextResponse.json(userUpdate, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching user data:', error);
        if (error.message === 'Invalid token' || error.message === 'Token expired') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
