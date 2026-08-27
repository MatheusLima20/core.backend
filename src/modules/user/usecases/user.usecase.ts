import { randomUUID } from "crypto";

import { IHashProvider } from "@/modules/auth/providers/hash-provider.interface";
import { MembershipProps } from "@/modules/membership/entities/membership.props";
import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";
import { MembershipNotFoundError } from "@/modules/membership/errors/membership-not-found.error";
import { IMembershipRepository } from "@/modules/membership/repositories/membership-repository.interface";
import { RequestContext } from "@/shared/context/request-context";
import { ITransactionManager } from "@/shared/database/transaction/transaction-manager.interface";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { CreateUserDTO, CreateUserResponseDTO } from "../dtos/create-user.dto";
import { FindUsersDTO } from "../dtos/find-users.dto";
import { UpdateUserDTO, UpdateUserResponseDTO } from "../dtos/update-user.dto";
import { UserResponseDTO } from "../dtos/user-response.dto";
import { UserEntity } from "../entities/user.entity";
import { UserAlreadyExistsError } from "../errors/user-already-exists.error";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { UserMapper } from "../mappers/user.mapper";
import { IUserRepository } from "../repositories/user-repository-interface";

export class UserUseCase {
    constructor(
        private readonly context: RequestContext,
        private readonly transactionManager: ITransactionManager,
        private readonly userRepository: IUserRepository,
        private readonly membershipRepository: IMembershipRepository,
        private readonly hashProvider: IHashProvider
    ) {}

    async find(data: FindUsersDTO): Promise<Result<PaginationResult<UserResponseDTO>>> {
        const membershipsResult = await this.membershipRepository.listByPlatform(
            this.context.user.platformUID
        );

        if (isFailure(membershipsResult)) {
            return ResultFactory.failure(
                new PersistenceError("Failed to find platform memberships.")
            );
        }

        const userUIDs = membershipsResult.data.map((membership) => membership.userUID);

        const usersResult = await this.userRepository.findByUIDs(userUIDs, data);

        if (isFailure(usersResult)) {
            return ResultFactory.failure(new PersistenceError("Failed to find platform users."));
        }

        return ResultFactory.success({
            ...usersResult.data,
            data: usersResult.data.data.map((user) => UserMapper.toUserResponseDTO(user)),
        });
    }

    async findByUID(uid: string): Promise<Result<UserResponseDTO | null>> {
        const result = await this.userRepository.findByUID(uid);

        if (isFailure(result)) {
            return ResultFactory.success(null);
        }

        return ResultFactory.success(result.data);
    }

    async findByEmail(email: string): Promise<Result<UserResponseDTO | null>> {
        const result = await this.userRepository.findByEmail(email);

        if (isFailure(result)) {
            return ResultFactory.success(null);
        }

        return ResultFactory.success(result.data);
    }

    async create(data: CreateUserDTO): Promise<Result<CreateUserResponseDTO>> {
        return this.transactionManager.execute(async (transaction) => {
            const existingUserResult = await transaction.userRepository.findByEmail(data.email);

            if (isFailure(existingUserResult)) {
                return ResultFactory.failure(new PersistenceError("Failed to validate User."));
            }

            let user: UserEntity;

            if (existingUserResult.data) {
                user = existingUserResult.data;

                const existingMembershipResult =
                    await transaction.membershipRepository.findByUserAndPlatform(
                        user.uid,
                        this.context.user.platformUID
                    );

                if (isFailure(existingMembershipResult)) {
                    return ResultFactory.failure(
                        new PersistenceError("Failed to validate user membership.")
                    );
                }

                if (existingMembershipResult.data) {
                    return ResultFactory.failure(
                        new UserAlreadyExistsError({
                            name: user.name,
                        })
                    );
                }
            } else {
                const password = await this.hashProvider.hash(data.password);

                user = new UserEntity({
                    uid: randomUUID(),
                    ...data,
                    isActivated: true,
                    password,
                    createdBy: this.context.user.uid,
                    updatedBy: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const userResult = await transaction.userRepository.register(user);

                if (isFailure(userResult)) {
                    return ResultFactory.failure(new PersistenceError("Failed to register user."));
                }

                user = userResult.data;
            }

            const membership: MembershipProps = {
                uid: randomUUID(),
                userUID: user.uid,
                platformUID: this.context.user.platformUID,
                role: data.role ?? MembershipRole.MEMBER,
                createdAt: new Date(),
            };

            const membershipResult = await transaction.membershipRepository.create(membership);

            if (isFailure(membershipResult)) {
                return ResultFactory.failure(
                    new PersistenceError("Failed to create user membership.")
                );
            }

            return ResultFactory.success(UserMapper.toCreateUserResponseDTO(user));
        });
    }

    async update(data: UpdateUserDTO): Promise<Result<UpdateUserResponseDTO>> {
        return this.transactionManager.execute(async (transaction) => {
            const existingUser = await transaction.userRepository.findByEmail(data.email ?? "");

            if (isFailure(existingUser)) {
                return ResultFactory.failure(new PersistenceError("Failed to validate User."));
            }

            if (existingUser.data && existingUser.data.uid !== data.uid) {
                return ResultFactory.failure(
                    new UserAlreadyExistsError({
                        name: data.name,
                    })
                );
            }

            const oldUser = await transaction.userRepository.findByUID(data.uid);

            if (isFailure(oldUser)) {
                return ResultFactory.failure(new PersistenceError("Failed to find User."));
            }

            const requiredUser = ResultMapper.requireData(
                oldUser,
                new UserNotFoundError({
                    uid: data.uid,
                })
            );

            if (isFailure(requiredUser)) {
                return requiredUser;
            }

            const password = data.password
                ? await this.hashProvider.hash(data.password)
                : requiredUser.data.password;

            const user = new UserEntity({
                ...requiredUser.data,
                ...data,
                password,
                updatedBy: this.context.user.uid,
                updatedAt: new Date(),
            });

            const userResult = await transaction.userRepository.update(user);

            if (isFailure(userResult)) {
                return ResultFactory.failure(new PersistenceError("Failed to update User."));
            }

            if (data.role !== undefined) {
                const membershipResult =
                    await transaction.membershipRepository.findByUserAndPlatform(
                        data.uid,
                        this.context.user.platformUID
                    );

                if (isFailure(membershipResult)) {
                    return ResultFactory.failure(
                        new PersistenceError("Failed to find user membership.")
                    );
                }

                const membership = ResultMapper.requireData(
                    membershipResult,
                    new MembershipNotFoundError({
                        uid: data.uid,
                    })
                );

                if (isFailure(membership)) {
                    return membership;
                }

                const updatedMembership: MembershipProps = {
                    ...membership.data,
                    role: data.role,
                };

                const membershipUpdateResult =
                    await transaction.membershipRepository.update(updatedMembership);

                if (isFailure(membershipUpdateResult)) {
                    return ResultFactory.failure(
                        new PersistenceError("Failed to update user membership.")
                    );
                }
            }

            return ResultFactory.success(UserMapper.toUpdateUserResponseDTO(userResult.data));
        });
    }

    async delete(uid: string): Promise<Result<boolean>> {
        const user = await this.userRepository.findByUID(uid);

        if (isFailure(user)) {
            return user;
        }

        const requiredUser = ResultMapper.requireData(
            user,
            new UserNotFoundError({
                uid,
            })
        );

        if (isFailure(requiredUser)) {
            return requiredUser;
        }

        const result = await this.userRepository.delete(uid);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete User."));
        }

        return ResultFactory.success(result.data);
    }
}
