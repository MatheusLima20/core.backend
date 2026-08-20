import { Router } from "express";

import { PlatformController } from "../controllers/platform.controller";
import { InMemoryPlatformRepository } from "../repositories/implementations/in-memory-platform.repository";
import { PlatformUsecase } from "../usecases/platform.usecase";

const router = Router();

const repository = new InMemoryPlatformRepository();
const usecase = new PlatformUsecase(repository);
const controller = new PlatformController(usecase);

router.post("/", async (request, response) => {
    await controller.create(request, response);
});

router.get("/", async (request, response) => {
    await controller.find(request, response);
});

router.get("/:uid", async (request, response) => {
    await controller.findByUID(request, response);
});

router.put("/:uid", async (request, response) => {
    await controller.update(request, response);
});

router.delete("/:uid", async (request, response) => {
    await controller.delete(request, response);
});

export default {
    router,
    path: "/platform",
};
