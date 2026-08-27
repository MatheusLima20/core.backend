import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindUsersDTO } from "../../dtos/find-users.dto";
import { UserEntity } from "../../entities/user.entity";
import { UserProps } from "../../entities/user.props";
import { IUserRepository } from "../user-repository-interface";

export class TypeORMUserRepository implements IUserRepository {
    constructor(private readonly repository: Repository<UserEntity>) {}

    async findByUIDs(
        uids: string[],
        data: FindUsersDTO = {}
    ): Promise<Result<PaginationResult<UserProps>>> {
        if (uids.length === 0) {
            return ResultFactory.success({
                data: [],
                page: data.page ?? 1,
                limit: data.limit ?? 10,
                total: 0,
                totalPages: 0,
            });
        }

        const page = data.page ?? 1;
        const limit = data.limit ?? 10;

        const query = this.repository
            .createQueryBuilder("user")
            .where("user.uid IN (:...uids)", { uids });

        if (data.name) {
            query.andWhere("user.name ILIKE :name", {
                name: `%${data.name}%`,
            });
        }

        if (data.email) {
            query.andWhere("user.email ILIKE :email", {
                email: `%${data.email}%`,
            });
        }

        if (data.isActivated !== undefined) {
            query.andWhere("user.isActivated = :isActivated", {
                isActivated: data.isActivated,
            });
        }

        if (data.orderBy) {
            query.orderBy(`user.${data.orderBy}`, data.order === "desc" ? "DESC" : "ASC");
        }

        query.skip((page - 1) * limit);
        query.take(limit);

        const [users, total] = await query.getManyAndCount();

        return ResultFactory.success({
            data: users,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    }

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
