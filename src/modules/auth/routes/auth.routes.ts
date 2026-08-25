import { Router } from "express";

import { makeAuthController } from "../factories/login-controller.factory";

const router = Router();

const controller = makeAuthController();

router.post("/login", async (request, response) => {
    await controller.login(request, response);
});

export default {
    path: "/auth",
    router,
};
