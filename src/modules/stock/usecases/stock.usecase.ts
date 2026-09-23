import { ProductNotFoundError } from "@/modules/product/errors/product-not-found.error";
import { IProductRepository } from "@/modules/product/repositories/product-repository.interface";
import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { CreateStockDTO, CreateStockResponseDTO } from "../dtos/create-stock.dto";
import { FindStocksDTO } from "../dtos/find-stocks.dto";
import { StockListResponseDTO } from "../dtos/stock-list-response.dto";
import { StockResponseDTO } from "../dtos/stock-response.dto";
import { UpdateStockDTO, UpdateStockResponseDTO } from "../dtos/update-stock.dto";
import { StockEntity } from "../entities/stock.entity";
import { StockAlreadyExistsError } from "../errors/stock-already-exists.error";
import { StockNotFoundError } from "../errors/stock-not-found.error";
import { StockMapper } from "../mappers/stock.mapper";
import { IStockRepository } from "../repositories/stock-repository.interface";
import { StockWithProduct } from "../types/stock-with-product";

export class StockUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly stockRepository: IStockRepository,
        private readonly productRepository: IProductRepository
    ) {}

    async create(data: CreateStockDTO): Promise<Result<CreateStockResponseDTO>> {
        const product = await this.validateProduct(data.productUID);

        if (isFailure(product)) {
            return ResultFactory.failure(product.error);
        }

        const validation = await this.validateStockAlreadyExists(data.productUID);

        if (isFailure(validation)) {
            return validation;
        }

        const stock = new StockEntity({
            ...data,
            platformUID: this.context.user.platformUID,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: this.context.user.uid,
        });

        const created = await this.stockRepository.register(stock);

        if (isFailure(created)) {
            return ResultFactory.failure(new PersistenceError("Failed to create stock."));
        }

        return ResultMapper.map(created, StockMapper.toCreatedResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<StockResponseDTO>> {
        const result = await this.stockRepository.findByUID(uid, this.context.user.platformUID);

        const stock = ResultMapper.requireData(result, new StockNotFoundError({ uid }));

        return ResultMapper.map(stock, StockMapper.toResponseDTO);
    }

    async find(filters?: FindStocksDTO): Promise<Result<PaginationResult<StockListResponseDTO>>> {
        const result = await this.stockRepository.find(filters, this.context.user.platformUID);

        if (isFailure(result)) {
            return ResultFactory.failure(result.error);
        }

        const data: StockListResponseDTO[] = result.data.data.map(({ stock, product }) =>
            StockMapper.toListResponseDTO({ stock, product })
        );

        return ResultFactory.success({
            ...result.data,
            data,
        });
    }

    async update(data: UpdateStockDTO): Promise<Result<UpdateStockResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (isFailure(existing)) {
            return existing;
        }

        const stock = new StockEntity({
            ...existing.data,
            ...data,
            updatedAt: new Date(),
            updatedBy: this.context.user.uid,
        });

        const updated = await this.stockRepository.update(stock);

        if (!updated.success) {
            return ResultFactory.failure(new PersistenceError("Failed to update stock."));
        }

        return ResultMapper.map(updated, StockMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.stockRepository.findByUID(uid, this.context.user.platformUID);

        if (!existing.success) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch stock."));
        }

        if (!existing.data) {
            return ResultFactory.failure(new StockNotFoundError({ uid }));
        }

        const deleted = await this.stockRepository.delete(uid);

        if (!deleted.success) {
            return ResultFactory.failure(new PersistenceError("Failed to delete stock."));
        }

        return ResultFactory.ok();
    }

    private async validateProduct(productUID: string): Promise<Result<void>> {
        const result = await this.productRepository.findByUID(
            productUID,
            this.context.user.platformUID
        );

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch product."));
        }

        if (!result.data) {
            return ResultFactory.failure(new ProductNotFoundError({ uid: productUID }));
        }

        return ResultFactory.ok();
    }

    private async validateStockAlreadyExists(
        productUID: string
    ): Promise<Result<StockWithProduct | null>> {
        const result = await this.stockRepository.find(
            {
                productUID,
            },
            this.context.user.platformUID
        );

        if (isFailure(result)) {
            return result;
        }

        const [stock] = result.data.data;

        if (stock) {
            return ResultFactory.failure(new StockAlreadyExistsError({ productUID }));
        }

        return ResultFactory.success(null);
    }
}
