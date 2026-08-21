import { Router } from "express";

import { dataSource } from "@/services/database/database";

import { PlatformController } from "../controllers/platform.controller";
import { PlatformEntity } from "../entities/platform.entities";
import { TypeORMPlatformRepository } from "../repositories/implementations/type-orm-platform.repository";
import { PlatformUsecase } from "../usecases/platform.usecase";

const router = Router();

const repository = new TypeORMPlatformRepository(dataSource.getRepository(PlatformEntity));

const usecase = new PlatformUsecase(repository);

const controller = new PlatformController(usecase);

router.post("/create", async (request, response) => {
    await controller.create(request, response);
});

router.put("/update/:uid", async (request, response) => {
    await controller.update(request, response);
});

router.get("/find/name/:name", async (request, response) => {
    await controller.findByName(request, response);
});

router.get("/find/:uid", async (request, response) => {
    await controller.findByUID(request, response);
});

router.get("/find", async (request, response) => {
    await controller.find(request, response);
});

router.delete("delete/:uid", async (request, response) => {
    await controller.delete(request, response);
});

export default {
    path: "/platform",
    router,
};
