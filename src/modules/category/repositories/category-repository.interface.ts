import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindCategoriesDTO } from "../dtos/find-categories.dto";
import { CategoryEntity } from "../entities/category.entity";

export interface ICategoryRepository {
    findByUID(uid: string, platformUID?: string): Promise<Result<CategoryEntity | null>>;

    find(
        filters?: FindCategoriesDTO,
        platformUID?: string
    ): Promise<Result<PaginationResult<CategoryEntity>>>;

    register(category: CategoryEntity): Promise<Result<CategoryEntity>>;

    update(category: CategoryEntity): Promise<Result<CategoryEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
