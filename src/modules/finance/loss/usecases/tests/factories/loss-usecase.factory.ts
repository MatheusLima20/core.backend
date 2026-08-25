import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryLossRepository } from "../../../repositories/implementations/in-memory-loss.repository";
import { LossUsecase } from "../../loss.usecase";

export function makeLossUsecase(user: AuthUser, lossRepository: InMemoryLossRepository) {
    const context = { user };

    return {
        usecase: new LossUsecase(context, lossRepository),
    };
}
