import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const countries = await prisma.country.findMany({
            include: {
                usernameRule: true,
            },
        });

        return NextResponse.json(countries, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: 'An error occurred while fetching the countries.'}, {status: 500});
    }
}
