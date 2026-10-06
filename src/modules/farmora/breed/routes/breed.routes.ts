import { Router } from "express";

import { AuthMiddleware } from "@/modules/auth/middleware/auth.middleware";
import { JWTTokenProvider } from "@/modules/auth/providers/implementations/jwt-token-provider";

import { makeBreedController } from "../factories/breed-controller.factory";

const router = Router();

const tokenProvider = new JWTTokenProvider();

const authMiddleware = new AuthMiddleware(tokenProvider);

router.use(authMiddleware.handle.bind(authMiddleware));

router.get("/find", async (request, response) => {
    const controller = makeBreedController();

    await controller.find(request, response);
});

export default {
    path: "/breed",
    router,
};
