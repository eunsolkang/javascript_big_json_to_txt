import mysql from 'mysql';

export default async function connect() {
    const connection = await mysql.createConnection({
        host: process.env.DATABASE_URL,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    });
    return connection;
}