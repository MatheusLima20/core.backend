import { Repository } from "typeorm";

import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { UserEntity } from "../../entities/user.entity";
import { UserProps } from "../../entities/user.props";
import { UserType } from "../../enum/user-type.enum";
import { IUserRepository } from "../user-repository-interface";

export class TypeORMUserRepository implements IUserRepository {
    constructor(private readonly repository: Repository<UserEntity>) {}

    async findByUID(uid: string): Promise<Result<UserProps | null>> {
        const user = await this.repository.findOne({
            where: {
                uid,
            },
        });

        return ResultFactory.success(user ? user : null);
    }

    async findByEmail(email: string): Promise<Result<UserProps | null>> {
        const user = await this.repository.findOne({
            where: {
                email,
            },
        });

        return ResultFactory.success(user ? user : null);
    }

    async findByType(type: UserType): Promise<Result<UserProps[]>> {
        const users = await this.repository.find({
            where: {
                userType: type,
            },
        });

        return ResultFactory.success(users);
    }

    async find(platformUID: string): Promise<Result<UserProps[]>> {
        const users = await this.repository.find({
            where: {
                platformUID,
            },
        });

        return ResultFactory.success(users);
    }

    async register(user: UserProps): Promise<Result<UserProps>> {
        const savedUser = await this.repository.save(user);

        return ResultFactory.success(savedUser);
    }

    async update(user: UserProps): Promise<Result<UserProps>> {
        const updatedUser = await this.repository.save(user);

        return ResultFactory.success(updatedUser);
    }

    async delete(uid: string): Promise<Result<boolean>> {
        const result = await this.repository.delete({
            uid,
        });

        return ResultFactory.success(result.affected !== 0);
    }
}
