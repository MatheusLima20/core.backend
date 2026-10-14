import { Router } from "express";

import { AuthMiddleware } from "@/modules/auth/middleware/auth.middleware";
import { JWTTokenProvider } from "@/modules/auth/providers/implementations/jwt-token-provider";

import { makeWeightStandardController } from "../factories/weight-standard-controller.factory";

const router = Router();

const tokenProvider = new JWTTokenProvider();

const authMiddleware = new AuthMiddleware(tokenProvider);

router.use(authMiddleware.handle.bind(authMiddleware));

router.get("/find", async (request, response) => {
    const controller = makeWeightStandardController();

    await controller.find(request, response);
});

export default {
    path: "/weight-standard",
    router,
};
