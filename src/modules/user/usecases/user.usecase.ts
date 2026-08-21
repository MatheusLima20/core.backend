import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { CreateUserDTO, CreateUserResponseDTO } from "../dtos/create-user.dto";
import { UpdateUserDTO, UpdateUserResponseDTO } from "../dtos/update-user.dto";
import { UserResponseDTO } from "../dtos/user-response.dto";
import { UserEntity } from "../entities/user.entity";
import { UserType } from "../enum/user-type.enum";
import { UserAlreadyExistsError } from "../errors/user-already-exists.error";
import { UserNotFoundError } from "../errors/user-not-found.error";
import { UserMapper } from "../mappers/user.mapper";
import { IUserRepository } from "../repositories/user-repository-interface";

export class UserUseCase {
    constructor(
        private readonly context: RequestContext,
        private userRepository: IUserRepository
    ) {}

    async find(): Promise<Result<UserResponseDTO[]>> {
        const result = await this.userRepository.find(this.context.user.platformUID);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch platforms."));
        }

        return ResultFactory.success(result.data);
    }

    async findByUID(uid: string): Promise<Result<UserResponseDTO | null>> {
        const result = await this.userRepository.findByUID(uid);

        if (isFailure(result)) {
            return ResultFactory.success(null);
        }

        return ResultFactory.success(result.data);
    }

    async findByType(userType: UserType): Promise<Result<UserResponseDTO[]>> {
        const result = await this.userRepository.findByType(userType);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch platforms."));
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
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (isFailure(existingUser)) {
            return ResultFactory.failure(new PersistenceError("Failed to validate platform."));
        }

        if (existingUser.data) {
            return ResultFactory.failure(
                new UserAlreadyExistsError({ name: existingUser.data.name })
            );
        }

        const user = new UserEntity({
            uid: randomUUID(),
            ...data,
            createdBy: this.context.user.uid,
            updatedBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const result = await this.userRepository.register(user);

        if (!result) {
            throw new Error("User Not Register");
        }

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to register platform."));
        }

        return ResultFactory.success(UserMapper.toCreateUserResponseDTO(result.data));
    }

    async update(data: UpdateUserDTO): Promise<Result<UpdateUserResponseDTO>> {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (isFailure(existingUser)) {
            return ResultFactory.failure(new PersistenceError("Failed to validate platform."));
        }

        if (existingUser.data && existingUser.data.uid !== data.uid) {
            return ResultFactory.failure(new UserAlreadyExistsError({ name: data.name }));
        }

        const oldUser = await this.findByUID(data.uid);

        if (isFailure(oldUser)) {
            return oldUser;
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

        if (isFailure(requiredUser)) {
            return requiredUser;
        }

        const user = new UserEntity({
            ...requiredUser.data,
            ...data,
            password: data.password,
            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const result = await this.userRepository.update(user);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to update User."));
        }

        return ResultFactory.success(UserMapper.toUpdateUserResponseDTO(result.data));
    }

    async delete(uid: string): Promise<Result<boolean>> {
        const user = await this.findByUID(uid);

        if (isFailure(user)) {
            return user;
        }

        const requiredUser = ResultMapper.requireData(
            user,
            new UserNotFoundError({
                uid: uid,
            })
        );

        if (isFailure(requiredUser)) {
            return requiredUser;
        }

        const result = await this.userRepository.delete(uid);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete platform."));
        }

        return ResultFactory.success(result.data);
    }
}
