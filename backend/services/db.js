const { PrismaClient } = require('@prisma/client');

// Fix for Supabase Transaction Pooler (pgbouncer)
// Prisma tries to use prepared statements which fail on port 6543 unless pgbouncer=true is set.
const url = process.env.DATABASE_URL;
let datasources = {};

if (url && !url.includes('pgbouncer=true') && url.includes('6543')) {
    const newUrl = url.includes('?') ? `${url}&pgbouncer=true` : `${url}?pgbouncer=true`;
    console.log("Patching DATABASE_URL for pgbouncer compatibility");
    datasources = {
        db: {
            url: newUrl
        }
    };
}

const prisma = new PrismaClient({
    datasources: Object.keys(datasources).length > 0 ? datasources : undefined
});

module.exports = prisma;
