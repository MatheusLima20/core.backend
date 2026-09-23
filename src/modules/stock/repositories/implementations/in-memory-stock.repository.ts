import { ProductNotFoundError } from "@/modules/product/errors/product-not-found.error";
import { IProductRepository } from "@/modules/product/repositories/product-repository.interface";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";

import { FindStocksDTO } from "../../dtos/find-stocks.dto";
import { StockEntity } from "../../entities/stock.entity";
import { StockWithProduct } from "../../types/stock-with-product";
import { IStockRepository } from "../stock-repository.interface";

export class InMemoryStockRepository implements IStockRepository {
    constructor(private readonly productRepository: IProductRepository) {}

    private stocks: StockEntity[] = [];

    async findByUID(uid: string, platformUID: string): Promise<Result<StockEntity | null>> {
        const stock =
            this.stocks.find((stock) => stock.platformUID === platformUID && stock.uid === uid) ??
            null;

        return ResultFactory.success(stock);
    }

    async find(
        filters?: FindStocksDTO,
        platformUID?: string
    ): Promise<Result<PaginationResult<StockWithProduct>>> {
        let stocks = [...this.stocks];

        if (platformUID) {
            stocks = stocks.filter((stock) => stock.platformUID === platformUID);
        }

        if (filters?.productUID) {
            stocks = stocks.filter((stock) => stock.productUID === filters.productUID);
        }

        if (filters?.orderBy) {
            stocks.sort((a, b) => {
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

        const total = stocks.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;

        const paginatedStocks = stocks.slice(start, start + limit);

        const data: StockWithProduct[] = [];

        for (const stock of paginatedStocks) {
            const productResult = await this.productRepository.findByUID(
                stock.productUID,
                stock.platformUID
            );

            if (isFailure(productResult)) {
                return ResultFactory.failure(productResult.error);
            }

            if (!productResult.data) {
                return ResultFactory.failure(
                    new ProductNotFoundError({
                        uid: stock.productUID,
                    })
                );
            }

            data.push({
                stock,
                product: {
                    name: productResult.data.name,
                    description: productResult.data.description ?? null,
                    price: productResult.data.price,
                },
            });
        }

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
        });
    }

    async register(stock: StockEntity): Promise<Result<StockEntity>> {
        this.stocks.push(stock);

        return ResultFactory.success(stock);
    }

    async update(stock: StockEntity): Promise<Result<StockEntity>> {
        const index = this.stocks.findIndex((item) => item.uid === stock.uid);

        this.stocks[index] = stock;

        return ResultFactory.success(stock);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.stocks.findIndex((stock) => stock.uid === uid);

        if (index !== -1) {
            this.stocks.splice(index, 1);
        }

        return ResultFactory.success(undefined);
    }
}
