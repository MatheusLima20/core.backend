import { Router } from "express";

import { AuthMiddleware } from "@/modules/auth/middleware/auth.middleware";
import { JWTTokenProvider } from "@/modules/auth/providers/implementations/jwt-token-provider";

import { makeNutritionController } from "../factories/nutrition-controller.factory";

const router = Router();

const tokenProvider = new JWTTokenProvider();

const authMiddleware = new AuthMiddleware(tokenProvider);

router.use(authMiddleware.handle.bind(authMiddleware));

router.get("/find/:uid", async (request, response) => {
    const controller = makeNutritionController();

    await controller.findByUID(request, response);
});

router.get("/find/week/:week", async (request, response) => {
    const controller = makeNutritionController();

    await controller.findByWeek(request, response);
});

router.get("/find", async (request, response) => {
    const controller = makeNutritionController();

    await controller.find(request, response);
});

export default {
    path: "/nutrition",
    router,
};
