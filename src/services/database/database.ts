import "reflect-metadata";

import dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

import { IDatabase } from "./interface/database.interface";

dotenv.config();

type DatabaseType = "mysql" | "mariadb";

function getEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}

const config: DataSourceOptions = {
    type: getEnv("DB_TYPE") as DatabaseType,
    host: getEnv("DB_HOST"),
    port: Number(getEnv("DB_PORT")),
    username: getEnv("DB_USER"),
    password: getEnv("DB_PASSWORD"),
    database: getEnv("DB_DATABASE"),

    synchronize: true,
    logging: false,

    entities: [getEnv("PATH_ENTITY")],
    migrations: [getEnv("PATH_MIGRATION")],
    subscribers: [getEnv("PATH_SUBSCRIBER")],
};

class DatabaseClass implements IDatabase {
    connection: DataSource;

    constructor() {
        this.connection = new DataSource(config);
    }

    async start(): Promise<void> {
        await this.connection.initialize();
    }
}

export const databaseClass = new DatabaseClass();
export const dataSource = databaseClass.connection;
