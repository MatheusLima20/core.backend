import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindStocksDTO } from "../../dtos/find-stocks.dto";
import { StockEntity } from "../../entities/stock.entity";
import { IStockRepository } from "../stock-repository.interface";

export class InMemoryStockRepository implements IStockRepository {
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
    ): Promise<Result<PaginationResult<StockEntity>>> {
        let stocks = this.stocks;

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

        const data = stocks.slice(start, start + limit);

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
