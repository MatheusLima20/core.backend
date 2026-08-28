import { Router } from "express";

import { AuthMiddleware } from "@/modules/auth/middleware/auth.middleware";
import { JWTTokenProvider } from "@/modules/auth/providers/implementations/jwt-token-provider";

import { makeFeedController } from "../factories/feed-controller.factory";

const router = Router();

const tokenProvider = new JWTTokenProvider();

const authMiddleware = new AuthMiddleware(tokenProvider);

router.use(authMiddleware.handle.bind(authMiddleware));

router.post("/:platformUID/create", async (request, response) => {
    const controller = makeFeedController(request.auth);

    await controller.create(request, response);
});

router.put("/:platformUID/update/:uid", async (request, response) => {
    const controller = makeFeedController(request.auth);

    await controller.update(request, response);
});

router.get("/:platformUID/find/:uid", async (request, response) => {
    const controller = makeFeedController(request.auth);

    await controller.findByUID(request, response);
});

router.get("/:platformUID/find", async (request, response) => {
    const controller = makeFeedController(request.auth);

    await controller.find(request, response);
});

router.delete("/:platformUID/delete/:uid", async (request, response) => {
    const controller = makeFeedController(request.auth);

    await controller.delete(request, response);
});

export default {
    path: "/feed",
    router,
};
