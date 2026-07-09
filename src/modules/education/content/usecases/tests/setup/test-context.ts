import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryContentRepository } from "../../../repositories/implementations/in-memory-content.repository";
import { ContentUsecase } from "../../content.usecase";

export class TestContext {
    userRepository = new InMemoryUserRepository();
    contentRepository = new InMemoryContentRepository();

    users: AuthUser[] = [];
    usecases: ContentUsecase[] = [];
}
