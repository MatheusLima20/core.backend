import { CategoryNotFoundError } from "@/modules/category/errors/category-not-found.error";
import { ICategoryRepository } from "@/modules/category/repositories/category-repository.interface";
import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { CreateProductDTO, CreateProductResponseDTO } from "../dtos/create-product.dto";
import { FindProductsDTO } from "../dtos/find-products.dto";
import { ProductListResponseDTO } from "../dtos/product-list-response.dto";
import { ProductResponseDTO } from "../dtos/product-response.dto";
import { UpdateProductDTO, UpdateProductResponseDTO } from "../dtos/update-product.dto";
import { ProductEntity } from "../entities/product.entity";
import { ProductAlreadyExistsError } from "../errors/product-already-exists.error";
import { ProductNotFoundError } from "../errors/product-not-found.error";
import { ProductMapper } from "../mappers/product.mapper";
import { IProductRepository } from "../repositories/product-repository.interface";

export class ProductUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly productRepository: IProductRepository,
        private readonly categoryRepository: ICategoryRepository
    ) {}

    async create(data: CreateProductDTO): Promise<Result<CreateProductResponseDTO>> {
        const category = await this.validateCategory(data.categoryUID);

        if (isFailure(category)) {
            return category;
        }

        const validation = await this.validateProductAlreadyExists(data.name);

        if (!validation.success) {
            return validation;
        }

        const product = new ProductEntity({
            ...data,
            platformUID: this.context.user.platformUID,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: this.context.user.uid,
        });

        const created = await this.productRepository.register(product);

        if (!created.success) {
            return ResultFactory.failure(new PersistenceError("Failed to create product."));
        }

        return ResultMapper.map(created, ProductMapper.toCreatedResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<ProductResponseDTO>> {
        const result = await this.productRepository.findByUID(uid, this.context.user.platformUID);

        const product = ResultMapper.requireData(result, new ProductNotFoundError({ uid }));

        return ResultMapper.map(product, ProductMapper.toResponseDTO);
    }

    async find(
        filters?: FindProductsDTO
    ): Promise<Result<PaginationResult<ProductListResponseDTO>>> {
        const result = await this.productRepository.find(filters, this.context.user.platformUID);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch products."));
        }

        return ResultFactory.success({
            ...result.data,
            data: result.data.data.map((item) => ProductMapper.toListResponseDTO(item)),
        });
    }

    async update(data: UpdateProductDTO): Promise<Result<UpdateProductResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (!existing.success) {
            return existing;
        }

        if (data.categoryUID && data.categoryUID !== existing.data.categoryUID) {
            const category = await this.validateCategory(data.categoryUID);

            if (isFailure(category)) {
                return category;
            }
        }

        const validation = await this.validateProductAlreadyExists(
            data.name ?? existing.data.name,
            data.uid
        );

        if (!validation.success) {
            return validation;
        }

        const product = new ProductEntity({
            ...existing.data,
            ...data,
            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const updated = await this.productRepository.update(product);

        if (!updated.success) {
            return ResultFactory.failure(new PersistenceError("Failed to update product."));
        }

        return ResultMapper.map(updated, ProductMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.productRepository.findByUID(uid, this.context.user.platformUID);

        if (isFailure(existing)) {
            return ResultFactory.failure(existing.error);
        }

        if (!existing.data) {
            return ResultFactory.failure(new ProductNotFoundError({ uid }));
        }

        const deleted = await this.productRepository.delete(uid);

        if (isFailure(deleted)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete product."));
        }

        return ResultFactory.ok();
    }

    private async validateCategory(categoryUID: string): Promise<Result<void>> {
        const result = await this.categoryRepository.findByUID(
            categoryUID,
            this.context.user.platformUID
        );

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch category."));
        }

        if (!result.data) {
            return ResultFactory.failure(new CategoryNotFoundError({ uid: categoryUID }));
        }

        return ResultFactory.ok();
    }

    private async validateProductAlreadyExists(
        name?: string | null,
        uid?: string
    ): Promise<Result<ProductResponseDTO | null>> {
        if (!name) {
            return ResultFactory.success(null);
        }

        const result = await this.productRepository.find(
            {
                name,
            },
            this.context.user.platformUID
        );

        if (isFailure(result)) {
            return ResultFactory.failure(result.error);
        }

        const [item] = result.data.data;

        if (!item) {
            return ResultFactory.success(null);
        }

        if (item.product.uid !== uid) {
            return ResultFactory.failure(new ProductAlreadyExistsError({ name }));
        }

        return ResultFactory.success(ProductMapper.toResponseDTO(item.product));
    }
}
