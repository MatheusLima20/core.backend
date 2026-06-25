import dotenv from "dotenv";
import * as http from "http";
import { Server } from "socket.io";

import { Interation, ISocket } from "./interface/socket.interface";
dotenv.config();

let io: Server;
const connection = "connection";
const platform = "platform";
const socket_origin: string = String(process.env.SOCKET_ORIGIN);

const interactions: Interation[] = [
    { hear: "send_orders", talk: "receive_orders" },
    { hear: "send_status", talk: "receive_status" },
];

const methods = ["GET", "POST", "PATCH"];

export class SocketClass implements ISocket {
    constructor(server: http.Server) {
        io = new Server(server, {
            cors: {
                origin: socket_origin,
                methods: methods,
            },
        });
    }

    reaction(hear: string, talk: string): void {
        io.on(connection, (socket) => {
            socket.on(platform, (data) => {
                socket.join(data);
            });

            socket.on(hear, (data) => {
                socket.to(data.platform).emit(talk, data);
            });
        });
    }

    runSocket(socket: SocketClass): void {
        interactions.map((interaction) => {
            socket.reaction(interaction.hear, interaction.talk);
        });
    }
}
