const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const salt = await bcrypt.genSalt(10);

    await prisma.locale.createMany({
        data: [
            {
                code: 'en',
                language: 'English',
                isDefault: true,
            },
            {
                code: 'ar',
                language: 'Arabic',
            },
            {
                code: 'es',
                language: 'Spanish',
            },
        ],
        skipDuplicates: true,
    });

    await prisma.country.createMany({
        data: [
            {
                name: 'United Arab Emirates',
                code: 'UAE',
            },
            {
                name: 'India',
                code: 'IN',
            },
            {
                name: 'United States',
                code: 'US',
            },
            {
                name: 'Germany',
                code: 'DE',
            },
        ],
        skipDuplicates: true,
    });

    const countryData = await prisma.country.findMany({
        where: {
            code: { in: ['UAE', 'IN', 'US', 'DE'] },
        },
    });

    const countryMap = countryData.reduce((map, country) => {
        map[country.code] = country.id;
        return map;
    }, {});

    await prisma.usernameRule.createMany({
        data: [
            {
                regex: '^[a-zA-Z0-9]{5,}$',
                message: 'Username must be alphanumeric and at least 5 characters long.',
                countryId: countryMap['UAE'],
            },
            {
                regex: '^[a-zA-Z][a-zA-Z0-9]{5,}$',
                message: 'Username must start with a letter and be at least 6 characters long.',
                countryId: countryMap['IN'],
            },
            {
                regex: '^[a-zA-Z0-9]{6,}$',
                message: 'Username must be alphanumeric and at least 6 characters long.',
                countryId: countryMap['US'],
            },
            {
                regex: '^[a-zA-Z][a-zA-Z0-9_]{5,}$',
                message: 'Username must start with a letter, contain only alphanumeric characters or underscores, and be at least 6 characters long.',
                countryId: countryMap['DE'],
            },
        ],
        skipDuplicates: true,
    });

    await prisma.user.createMany({
        data: [
            {
                email: 'user1@example.com',
                username: 'user123',
                password: await bcrypt.hash('password123', salt),
                countryId: countryMap['UAE'],
            },
            {
                email: 'user2@example.com',
                username: 'a123456',
                password: await bcrypt.hash('password123', salt),
                countryId: countryMap['IN'],
            },
            {
                email: 'user3@example.com',
                username: 'user789',
                password: await bcrypt.hash('password123', salt),
                countryId: countryMap['US'],
            },
            {
                email: 'user4@example.com',
                username: 'a_user1',
                password: await bcrypt.hash('password123', salt),
                countryId: countryMap['DE'],
            },
        ],
        skipDuplicates: true,
    });
}

main()
    .then(() => {
        console.log('Seed data created successfully');
    })
    .catch((e) => {
        console.error('Error creating seed data', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
