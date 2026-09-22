import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { CategoryResponseDTO } from "../dtos/category-response.dto";
import { CreateCategoryDTO, CreateCategoryResponseDTO } from "../dtos/create-category.dto";
import { FindCategoriesDTO } from "../dtos/find-categories.dto";
import { UpdateCategoryDTO, UpdateCategoryResponseDTO } from "../dtos/update-category.dto";
import { CategoryEntity } from "../entities/category.entity";
import { CategoryAlreadyExistsError } from "../errors/category-already-exists.error";
import { CategoryNotFoundError } from "../errors/category-not-found.error";
import { CategoryMapper } from "../mappers/category.mapper";
import { ICategoryRepository } from "../repositories/category-repository.interface";

export class CategoryUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly categoryRepository: ICategoryRepository
    ) {}

    async create(data: CreateCategoryDTO): Promise<Result<CreateCategoryResponseDTO>> {
        const validation = await this.validateCategoryAlreadyExists(data.name);

        if (!validation.success) {
            return validation;
        }

        const category = new CategoryEntity({
            ...data,
            platformUID: this.context.user.platformUID,

            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: this.context.user.uid,
        });

        const created = await this.categoryRepository.register(category);

        if (!created.success) {
            return ResultFactory.failure(new PersistenceError("Failed to create category."));
        }

        return ResultMapper.map(created, CategoryMapper.toCreatedResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<CategoryResponseDTO>> {
        const result = await this.categoryRepository.findByUID(uid, this.context.user.platformUID);

        const category = ResultMapper.requireData(result, new CategoryNotFoundError({ uid }));

        return ResultMapper.map(category, CategoryMapper.toResponseDTO);
    }

    async find(
        filters?: FindCategoriesDTO
    ): Promise<Result<PaginationResult<CategoryResponseDTO>>> {
        const result = await this.categoryRepository.find(filters, this.context.user.platformUID);

        if (!result.success) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch categories."));
        }

        return ResultMapper.map(result, (pagination) => ({
            ...pagination,
            data: CategoryMapper.toResponseDTOList(pagination.data),
        }));
    }

    async update(data: UpdateCategoryDTO): Promise<Result<UpdateCategoryResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (!existing.success) {
            return existing;
        }

        const validation = await this.validateCategoryAlreadyExists(
            data.name ?? existing.data.name,
            data.uid
        );

        if (!validation.success) {
            return validation;
        }

        const category = new CategoryEntity({
            ...existing.data,
            ...data,
            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const updated = await this.categoryRepository.update(category);

        if (!updated.success) {
            return ResultFactory.failure(new PersistenceError("Failed to update category."));
        }

        return ResultMapper.map(updated, CategoryMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.categoryRepository.findByUID(
            uid,
            this.context.user.platformUID
        );

        if (!existing.success) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch category."));
        }

        if (!existing.data) {
            return ResultFactory.failure(new CategoryNotFoundError({ uid }));
        }

        const deleted = await this.categoryRepository.delete(uid);

        if (!deleted.success) {
            return ResultFactory.failure(new PersistenceError("Failed to delete category."));
        }

        return ResultFactory.ok();
    }

    private async validateCategoryAlreadyExists(
        name?: string | null,
        uid?: string
    ): Promise<Result<CategoryResponseDTO | null>> {
        if (!name) {
            return ResultFactory.success(null);
        }

        const result = await this.categoryRepository.find(
            {
                name,
            },
            this.context.user.platformUID
        );

        if (isFailure(result)) {
            return result;
        }

        const [category] = result.data.data;

        if (category && category.uid !== uid) {
            return ResultFactory.failure(new CategoryAlreadyExistsError({ name }));
        }

        return ResultFactory.success(category ? CategoryMapper.toResponseDTO(category) : null);
    }
}
