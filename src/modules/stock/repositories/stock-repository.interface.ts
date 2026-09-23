import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindStocksDTO } from "../dtos/find-stocks.dto";
import { StockEntity } from "../entities/stock.entity";
import { StockWithProduct } from "../types/stock-with-product";

export interface IStockRepository {
    findByUID(uid: string, platformUID?: string): Promise<Result<StockEntity | null>>;

    find(
        filters?: FindStocksDTO,
        platformUID?: string
    ): Promise<Result<PaginationResult<StockWithProduct>>>;

    register(stock: StockEntity): Promise<Result<StockEntity>>;

    update(stock: StockEntity): Promise<Result<StockEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
