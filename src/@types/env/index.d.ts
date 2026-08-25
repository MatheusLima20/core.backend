declare namespace NodeJS {
    interface ProcessEnv extends Dict<string> {
        SOCKET_ORIGIN: string;
        HOST: string;
        HOST_NAME: string;
        PORT: string;

        DB_TYPE: string;
        DB_HOST: string;
        DB_PORT: string;
        DB_USER: string;
        DB_PASSWORD: string;
        DB_DATABASE: string;

        SAND_BOX: string;
        CLIENT_ID: string;
        CLIENT_SECRET: string;
        PATH_CERT: string;

        JWT_SECRET: string;
        EXPIRES_IN: string;
    }
}
