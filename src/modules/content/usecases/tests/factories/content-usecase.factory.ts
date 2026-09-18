import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryContentRepository } from "../../../repositories/implementations/in-memory-content.repository";
import { ContentUsecase } from "../../content.usecase";

export function makeContentUsecase(user: AuthUser, contentRepository: InMemoryContentRepository) {
    const context = { user };

    return {
        usecase: new ContentUsecase(context, contentRepository),
    };
}
