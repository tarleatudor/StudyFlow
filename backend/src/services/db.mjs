import dotenv from "dotenv";
import pkg from 'pg'
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

dotenv.config();
const { Pool } = pkg;

// configuring connection pool from postgres pg package
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

// Prisma adapter for postgres
const adapter = new PrismaPg(pool);

/**
 * singleton instance of prisma client using postres adapter
 * according to prisma 7 documentation, URL configurations are done here
 */

export const prisma = new PrismaClient({
    adapter,
    log: ["query", "info", "warn", "error"]
})

// testing connection with a query
pool.query('SELECT NOW()', (err, res) => {
    if(err)
        console.error('Error connecting to DB: ', err);
    else
        console.log('Connection succesful to PostgreSQL via adapter')
})