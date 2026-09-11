import { MembershipEntity } from "@/modules/membership/entities/membership.entity";
import { TypeORMMembershipRepository } from "@/modules/membership/repositories/implementations/type-orm-membership.repository";
import { PlatformEntity } from "@/modules/platform/entities/platform.entity";
import { TypeORMPlatformRepository } from "@/modules/platform/repositories/implementations/type-orm-platform.repository";
import { UserEntity } from "@/modules/user/entities/user.entity";
import { TypeORMUserRepository } from "@/modules/user/repositories/implementations/type-orm-user.repository";
import { dataSource } from "@/services/database/database";

import { AuthController } from "../controllers/auth.controller";
import { BcryptHashProvider } from "../providers/implementations/bcrypt-hash.provider";
import { JWTTokenProvider } from "../providers/implementations/jwt-token-provider";
import { LoginUsecase } from "../usecases/login.usecase";

export function makeAuthController(): AuthController {
    const userRepository = new TypeORMUserRepository(dataSource.getRepository(UserEntity));

    const membershipRepository = new TypeORMMembershipRepository(
        dataSource.getRepository(MembershipEntity)
    );

    const platformRepository = new TypeORMPlatformRepository(
        dataSource.getRepository(PlatformEntity)
    );

    const hashProvider = new BcryptHashProvider();

    const tokenProvider = new JWTTokenProvider();

    const usecase = new LoginUsecase(
        userRepository,
        membershipRepository,
        platformRepository,
        hashProvider,
        tokenProvider
    );

    return new AuthController(usecase);
}
