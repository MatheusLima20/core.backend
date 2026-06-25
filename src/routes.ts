import { Request, Response, Router } from "express";
import { readdirSync, statSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";

const routes = Router();

routes.get("/", (request: Request, response: Response) => {
    response.send({ msg: "Serviço rodando." });
});

async function loadRoutes(folderPath: string) {
    const files = readdirSync(folderPath);

    for (const fileName of files) {
        const fullPath = path.join(folderPath, fileName);

        const isDirectory = statSync(fullPath).isDirectory();

        if (isDirectory) {
            loadRoutes(fullPath);
            continue;
        }

        const isMapFile = fileName.endsWith(".map");
        const isRouteFile = fileName.endsWith("routes.ts");

        if (!isMapFile && isRouteFile) {
            const route = await import(pathToFileURL(fullPath).href);

            routes.use(route.default || route);
        }
    }
}

loadRoutes(path.join(__dirname, "./modules"));

export default routes;
