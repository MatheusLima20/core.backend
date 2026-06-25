import * as cors from "cors";
import * as express from "express";
import { createServer, Server } from "http";

import { customErrors } from "../../middlwares/CustomErrors/CelebrationMiddleware";
import routes from "../../routes";
import { IServer } from "./interface/server.interface";

const host: string = process.env.HOST_NAME;
const port: number = Number.parseInt(process.env.PORT);

const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: [
        "Accept-Version",
        "Authorization",
        "Credentials",
        "Content-Type",
        "Origin",
    ],
};

export class ServerClass implements IServer {
    private app: express.Express;
    public server: Server;

    constructor() {
        this.app = express();
        this.addResources();
        this.server = createServer(this.app);
    }

    private addResources(): void {    
        
        const app = this.app;

        app.use(express.static(__dirname, { dotfiles: "allow" }));

        app.use(cors(corsOptions));

        app.use(express.json());

        app.use(routes);

        app.use(customErrors());
    }

    public start(): void {

        this.server.listen(port, host, () => {
            return console.log("Server started on port: " + port + " 🏆!");
        });
    }
}

export const serverClass = new ServerClass();
