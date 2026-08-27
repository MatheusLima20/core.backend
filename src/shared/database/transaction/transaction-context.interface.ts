import { IMembershipRepository } from "@/modules/membership/repositories/membership-repository.interface";
import { IPlatformRepository } from "@/modules/platform/repositories/platform-repository.interface";
import { IUserRepository } from "@/modules/user/repositories/user-repository-interface";

export interface ITransactionContext {
    platformRepository: IPlatformRepository;
    userRepository: IUserRepository;
    membershipRepository: IMembershipRepository;
}
