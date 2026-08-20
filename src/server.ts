import "module-alias/register";
import "reflect-metadata";

import dotenv from "dotenv";

dotenv.config();

import { databaseClass } from "./services/database/database";
import { ServerClass, serverClass } from "./services/server/server";
import { SocketClass } from "./utils/socket/socket";

const server: ServerClass = serverClass;

const socket = new SocketClass(server.server);

socket.runSocket(socket);

async function bootstrap() {
    await databaseClass.start();

    server.start();
}

bootstrap();
