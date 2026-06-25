import "module-alias/register";
import "process";
import "reflect-metadata";

import dotenv from "dotenv";

import { databaseClass } from "./services/database/database";
import { ServerClass, serverClass } from "./services/server/server";
import { SocketClass } from "./utils/socket/socket";
dotenv.config();

const server: ServerClass = serverClass;

const socket = new SocketClass(server.server);

socket.runSocket(socket);

databaseClass.start();

server.start();
