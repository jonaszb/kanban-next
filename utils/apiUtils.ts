import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import mysql, { OkPacket } from 'mysql2/promise';

class ApiUtils {
    databaseUrl: string;

    constructor() {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL environment variable not set');
        }
        this.databaseUrl = process.env.DATABASE_URL;
    }

    async sendQuery(sql: string, params?: string[]) {
        const connection = await mysql.createConnection(this.databaseUrl);
        const response = await connection.execute(sql, params);
        connection.end();
        return response;
    }
}

export default ApiUtils;
