import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import mysql from 'mysql2/promise';

class ApiUtils {
    databaseUrl: string;

    constructor() {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL environment variable not set');
        }
        this.databaseUrl = process.env.DATABASE_URL;
    }

    async sendQuery(sql: string) {
        const connection = await mysql.createConnection(this.databaseUrl);
        const response = await connection.query(sql);
        connection.end();
        return response;
    }

    async sendQueries(sql: string[]) {
        const connection = await mysql.createConnection(this.databaseUrl);
        const responses = await Promise.all(
            sql.map(async (query) => {
                return await connection.query(query);
            })
        );
        connection.end();
        return responses;
    }
}

export default ApiUtils;
