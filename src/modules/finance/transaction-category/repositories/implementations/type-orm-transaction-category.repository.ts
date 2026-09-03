import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindTransactionCategoriesDTO } from "../../dtos/find-transaction-category.dto";
import { TransactionCategoryEntity } from "../../entities/transaction-category.entity";
import { ITransactionCategoryRepository } from "../transaction-category-repository.interface";

export class TypeORMTransactionCategoryRepository implements ITransactionCategoryRepository {
    constructor(
        private readonly transactionCategoryRepository: Repository<TransactionCategoryEntity>
    ) {}

    async findByUID(
        uid: string,
        platformUID?: string
    ): Promise<Result<TransactionCategoryEntity | null>> {
        const query = this.transactionCategoryRepository
            .createQueryBuilder("category")
            .where("category.uid = :uid", {
                uid,
            });

        if (platformUID) {
            query.andWhere("category.platformUID = :platformUID", {
                platformUID,
            });
        }

        const category = await query.getOne();

        return ResultFactory.success(category);
    }

    async find(
        filters?: FindTransactionCategoriesDTO,
        platformUID?: string
    ): Promise<Result<PaginationResult<TransactionCategoryEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.transactionCategoryRepository.createQueryBuilder("category");

        if (platformUID) {
            query.andWhere("category.platformUID = :platformUID", {
                platformUID,
            });
        }

        if (filters?.name) {
            query.andWhere("category.name ILIKE :name", {
                name: `%${filters.name}%`,
            });
        }

        if (filters?.type) {
            query.andWhere("category.type = :type", {
                type: filters.type,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `category.${filters.orderBy}`,
                filters.order?.toUpperCase() === "DESC" ? "DESC" : "ASC"
            );
        }

        const total = await query.getCount();

        query.skip((page - 1) * limit).take(limit);

        const data = await query.getMany();

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    }

    async register(
        category: TransactionCategoryEntity
    ): Promise<Result<TransactionCategoryEntity>> {
        const savedCategory = await this.transactionCategoryRepository.save(category);

        return ResultFactory.success(savedCategory);
    }

    async update(category: TransactionCategoryEntity): Promise<Result<TransactionCategoryEntity>> {
        const savedCategory = await this.transactionCategoryRepository.save(category);

        return ResultFactory.success(savedCategory);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.transactionCategoryRepository.delete(uid);

        return ResultFactory.ok();
    }
}
