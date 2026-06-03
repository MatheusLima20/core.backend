import { randomUUID } from "crypto";
import { CreateUserDTO, CreateUserResponseDTO } from "../dtos/create-user.dto";
import { UserEntity } from "../entities/user.entity";
import { IUserRepository } from "../repositories/user-repository-interface";
import { UserResponseDTO } from "../dtos/user-response.dto copy";
import { UserType } from "../enum/user-type.enum";
import { UpdateUserDTO } from "../dtos/update-user.dto";

export class UserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async find(platform: number): Promise<UserResponseDTO[]> {
        return await this.userRepository.find(platform);
    }

    async findByUID(uid: string): Promise<UserResponseDTO> {
        const user = await this.userRepository.findByUID(uid);

        if (!user) {
            throw new Error("User not found.");
        }

        return user;
    }

    async findByType(userType: UserType): Promise<UserResponseDTO[]> {
        return await this.userRepository.findByType(userType);
    }

    async findByEmail(email: string): Promise<UserResponseDTO> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error("User not found.");
        }

        return user;
    }

    async create(data: CreateUserDTO): Promise<CreateUserResponseDTO> {
        await this.validateEmailAlreadyExists(data.email);

        const user = new UserEntity({
            uid: randomUUID(),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const result = await this.userRepository.register(user);

        if (!result) {
            throw new Error("User Not Register");
        }

        return result;
    }

    async update(data: UpdateUserDTO) {
        await this.validateEmailAlreadyExists(data.email, data.uid);

        const oldUser = await this.findByUID(data.uid);

        const user = new UserEntity({
            ...oldUser,
            ...data,
            password: data.password,
            updatedAt: new Date(),
        });

        const result = await this.userRepository.update(user);

        if (!result) {
            throw new Error("User Not Updated.");
        }

        return result;
    }

    async delete(uid: string) {
        await this.findByUID(uid);

        const isDeleted = await this.userRepository.delete(uid);

        if (!isDeleted) {
            throw new Error("User not found!");
        }

        return isDeleted;
    }

    private async validateEmailAlreadyExists(email: string, uid?: string) {
        const user = await this.userRepository.findByEmail(email);

        if (user && user.uid !== uid) {
            throw new Error("Email already registered!");
        }
    }
}
