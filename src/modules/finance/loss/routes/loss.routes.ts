import { Router } from "express";

import { AuthMiddleware } from "@/modules/auth/middleware/auth.middleware";
import { JWTTokenProvider } from "@/modules/auth/providers/implementations/jwt-token-provider";

import { makeLossController } from "../factories/loss-controller.factory";

const router = Router();

const tokenProvider = new JWTTokenProvider();

const authMiddleware = new AuthMiddleware(tokenProvider);

router.use(authMiddleware.handle.bind(authMiddleware));

router.post("/create", async (request, response) => {
    const controller = makeLossController(request.auth);

    await controller.create(request, response);
});

router.put("/update/:uid", async (request, response) => {
    const controller = makeLossController(request.auth);

    await controller.update(request, response);
});

router.get("/find/:uid", async (request, response) => {
    const controller = makeLossController(request.auth);

    await controller.findByUID(request, response);
});

router.get("/find", async (request, response) => {
    const controller = makeLossController(request.auth);

    await controller.find(request, response);
});

router.delete("/delete/:uid", async (request, response) => {
    const controller = makeLossController(request.auth);

    await controller.delete(request, response);
});

export default {
    path: "/loss",
    router,
};
