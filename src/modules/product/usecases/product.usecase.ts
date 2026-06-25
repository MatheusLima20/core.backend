import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { AppError } from "@/shared/errors/app.error";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { FailureResult, Result, SuccessResult } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import {
    CreateProductDTO,
    CreateProductResponseDTO,
} from "../dtos/create-product.dto";
import { FindProductsDTO } from "../dtos/find-products.dto";
import { ProductResponseDTO } from "../dtos/product-response.dto";
import {
    UpdateProductDTO,
    UpdateProductResponseDTO,
} from "../dtos/update-product.dto";
import { ProductEntity } from "../entities/product.entity";
import { ProductProps } from "../entities/product.props";
import { ProductAlreadyExistsError } from "../errors/product-already-exists.error";
import { ProductNotFoundError } from "../errors/product-not-found.error";
import { ProductMapper } from "../mappers/product.mapper";
import { IProductRepository } from "../repositories/product-repository.interface";

export class ProductUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly productRepository: IProductRepository,
    ) {}

    async create(
        data: CreateProductDTO,
    ): Promise<Result<CreateProductResponseDTO>> {
        const validation = await this.validateProductAlreadyExists(
            data.name,
            this.context.user.platformUID,
        );

        if (!validation.success) {
            return validation;
        }

        const product = new ProductEntity({
            uid: randomUUID(),
            platformUID: this.context.user.platformUID,
            createdBy: this.context.user.uid,
            createdAt: new Date(),
            updatedAt: new Date(),
            updatedBy: null,
            ...data,
        });

        const created = await this.productRepository.register(product);

        if (!created.success) {
            return ResultFactory.failure(
                new PersistenceError("Failed to create product."),
            );
        }

        return ResultMapper.map(created, ProductMapper.toCreatedResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<ProductResponseDTO>> {
        const result = await this.productRepository.findByUID(
            uid,
            this.context.user.platformUID,
        );

        const product = ResultMapper.requireData(
            result,
            new ProductNotFoundError({ uid }),
        );

        return ResultMapper.map(product, ProductMapper.toResponseDTO);
    }

    async find(
        filters?: FindProductsDTO,
    ): Promise<Result<ProductResponseDTO[]>> {
        const product = await this.productRepository.find(
            this.context.user.platformUID,
            filters,
        );

        return ResultMapper.map(product, ProductMapper.toResponseDTOList);
    }

    async update(
        data: UpdateProductDTO,
    ): Promise<Result<UpdateProductResponseDTO>> {
        const result = await this.productRepository.findByUID(
            data.uid,
            this.context.user.platformUID,
        );

        if (!result.success) {
            return result;
        }

        const oldProduct = ResultMapper.requireData(
            result,
            new ProductNotFoundError({ uid: data.uid }),
        );

        if (!oldProduct.success) {
            return ResultFactory.failure(
                new ProductNotFoundError({ uid: data.uid }),
            );
        }

        const validation = await this.validateProductAlreadyExists(
            data.name,
            this.context.user.platformUID,
            data.uid,
        );

        if (!validation.success) {
            return validation;
        }

        const mergedProduct = new ProductEntity({
            ...oldProduct.data,
            ...data,
            updatedAt: new Date(),
            updatedBy: this.context.user.uid,
        });

        const updated = await this.productRepository.update(mergedProduct);

        return ResultMapper.map(updated, ProductMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.findByUID(uid);

        const isDeleted = await this.productRepository.delete(uid);

        if (!isDeleted.success) {
            return ResultFactory.failure(
                new PersistenceError("Failed to delete product."),
            );
        }

        return ResultFactory.ok();
    }

    private async validateProductAlreadyExists(
        name: string,
        platformUID: string,
        uid?: string,
    ): Promise<FailureResult<AppError> | SuccessResult<ProductProps | null>> {
        const result = await this.productRepository.find(platformUID, {
            name,
        });

        if (isFailure(result)) {
            return result;
        }

        const [product] = result.data;

        if (product && product.uid !== uid) {
            return ResultFactory.failure(new ProductAlreadyExistsError(name));
        }

        return ResultFactory.success(product);
    }
}
