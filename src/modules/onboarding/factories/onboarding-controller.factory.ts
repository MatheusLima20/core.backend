import { BcryptHashProvider } from "@/modules/auth/providers/implementations/bcrypt-hash.provider";
import { PlatformEntity } from "@/modules/platform/entities/platform.entities";
import { TypeORMPlatformRepository } from "@/modules/platform/repositories/implementations/type-orm-platform.repository";
import { UserEntity } from "@/modules/user/entities/user.entity";
import { TypeORMUserRepository } from "@/modules/user/repositories/implementations/type-orm-user.repository";
import { dataSource } from "@/services/database/database";

import { OnboardingController } from "../controller/onboarding.controller";
import { CreatePlatformOwnerUseCase } from "../usecases/create-platform-owner.usecase";

export function makeOnboardingController(): OnboardingController {
    const platformRepository = new TypeORMPlatformRepository(
        dataSource.getRepository(PlatformEntity)
    );

    const userRepository = new TypeORMUserRepository(dataSource.getRepository(UserEntity));

    const hashProvider = new BcryptHashProvider();

    const usecase = new CreatePlatformOwnerUseCase(
        platformRepository,
        userRepository,
        hashProvider
    );

    return new OnboardingController(usecase);
}
