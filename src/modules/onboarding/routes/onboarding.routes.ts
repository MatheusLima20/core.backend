import { Router } from "express";

import { makeOnboardingController } from "../factories/onboarding-controller.factory";

const router = Router();

const controller = makeOnboardingController();

router.post("/create", async (request, response) => {
    await controller.create(request, response);
});

export default {
    path: "/onboarding",
    router,
};
