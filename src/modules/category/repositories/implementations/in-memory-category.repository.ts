import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindCategoriesDTO } from "../../dtos/find-categories.dto";
import { CategoryEntity } from "../../entities/category.entity";
import { ICategoryRepository } from "../category-repository.interface";

export class InMemoryCategoryRepository implements ICategoryRepository {
    private categories: CategoryEntity[] = [];

    async findByUID(uid: string, platformUID: string): Promise<Result<CategoryEntity | null>> {
        const category =
            this.categories.find(
                (category) => category.platformUID === platformUID && category.uid === uid
            ) ?? null;

        return ResultFactory.success(category);
    }

    async find(
        filters?: FindCategoriesDTO,
        platformUID?: string
    ): Promise<Result<PaginationResult<CategoryEntity>>> {
        let categories = this.categories;

        if (platformUID) {
            categories = categories.filter((category) => category.platformUID === platformUID);
        }

        if (filters?.name) {
            categories = categories.filter((category) =>
                category.name.toLowerCase().includes(filters.name!.toLowerCase())
            );
        }

        if (filters?.orderBy) {
            categories.sort((a, b) => {
                const valueA = a[filters.orderBy!] ?? "";
                const valueB = b[filters.orderBy!] ?? "";

                if (valueA < valueB) {
                    return filters.order === "desc" ? 1 : -1;
                }

                if (valueA > valueB) {
                    return filters.order === "desc" ? -1 : 1;
                }

                return 0;
            });
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const total = categories.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;

        const data = categories.slice(start, start + limit);

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
        });
    }

    async register(category: CategoryEntity): Promise<Result<CategoryEntity>> {
        this.categories.push(category);

        return ResultFactory.success(category);
    }

    async update(category: CategoryEntity): Promise<Result<CategoryEntity>> {
        const index = this.categories.findIndex((item) => item.uid === category.uid);

        this.categories[index] = category;

        return ResultFactory.success(category);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.categories.findIndex((category) => category.uid === uid);

        if (index !== -1) {
            this.categories.splice(index, 1);
        }

        return ResultFactory.success(undefined);
    }
}
