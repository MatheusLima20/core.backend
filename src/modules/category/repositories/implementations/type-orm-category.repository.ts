import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindCategoriesDTO } from "../../dtos/find-categories.dto";
import { CategoryEntity } from "../../entities/category.entity";
import { ICategoryRepository } from "../category-repository.interface";

export class TypeORMCategoryRepository implements ICategoryRepository {
    constructor(private readonly categoryRepository: Repository<CategoryEntity>) {}

    async findByUID(uid: string, platformUID?: string): Promise<Result<CategoryEntity | null>> {
        const query = this.categoryRepository
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
        filters?: FindCategoriesDTO,
        platformUID?: string
    ): Promise<Result<PaginationResult<CategoryEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.categoryRepository.createQueryBuilder("category");

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

    async register(category: CategoryEntity): Promise<Result<CategoryEntity>> {
        const savedCategory = await this.categoryRepository.save(category);

        return ResultFactory.success(savedCategory);
    }

    async update(category: CategoryEntity): Promise<Result<CategoryEntity>> {
        const savedCategory = await this.categoryRepository.save(category);

        return ResultFactory.success(savedCategory);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.categoryRepository.delete(uid);

        return ResultFactory.ok();
    }
}
