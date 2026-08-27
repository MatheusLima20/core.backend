import { BcryptHashProvider } from "@/modules/auth/providers/implementations/bcrypt-hash.provider";
import { dataSource } from "@/services/database/database";
import { TypeORMTransactionManager } from "@/shared/database/transaction/implementations/typeorm-transaction-manager";

import { OnboardingController } from "../controller/onboarding.controller";
import { CreatePlatformOwnerUseCase } from "../usecases/create-platform-owner.usecase";

export function makeOnboardingController(): OnboardingController {
    const transactionManager = new TypeORMTransactionManager(dataSource);

    const hashProvider = new BcryptHashProvider();

    const usecase = new CreatePlatformOwnerUseCase(transactionManager, hashProvider);

    return new OnboardingController(usecase);
}
