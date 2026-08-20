import { Request, Response, Router } from "express";
import { readdirSync, statSync } from "fs";
import path from "path";

const routes = Router();

routes.get("/", (request: Request, response: Response) => {
    response.send({ msg: "It's run." });
});

async function loadRoutes(folderPath: string): Promise<void> {
    const files = readdirSync(folderPath);

    for (const fileName of files) {
        const fullPath = path.join(folderPath, fileName);

        const isDirectory = statSync(fullPath).isDirectory();

        if (isDirectory) {
            await loadRoutes(fullPath);
            continue;
        }

        const isMapFile = fileName.endsWith(".map");
        const isRouteFile = fileName.endsWith("routes.ts");

        if (isMapFile || !isRouteFile) {
            continue;
        }

        const route = await import(fullPath);

        if (route.default?.router && route.default?.path) {
            routes.use(route.default.path, route.default.router);

            continue;
        }

        routes.use(route.default || route);
    }
}

loadRoutes(path.join(__dirname, "./modules"));

export default routes;
