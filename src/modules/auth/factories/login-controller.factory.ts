import { UserEntity } from "@/modules/user/entities/user.entity";
import { TypeORMUserRepository } from "@/modules/user/repositories/implementations/type-orm-user.repository";
import { dataSource } from "@/services/database/database";

import { AuthController } from "../controllers/auth.controller";
import { BcryptHashProvider } from "../providers/implementations/bcrypt-hash.provider";
import { JWTTokenProvider } from "../providers/implementations/jwt-token-provider";
import { LoginUsecase } from "../usecases/login.usecase";

export function makeAuthController(): AuthController {
    const userRepository = new TypeORMUserRepository(dataSource.getRepository(UserEntity));

    const hashProvider = new BcryptHashProvider();

    const tokenProvider = new JWTTokenProvider();

    const usecase = new LoginUsecase(userRepository, hashProvider, tokenProvider);

    return new AuthController(usecase);
}
