import { StockEntity } from "../entities/stock.entity";

export interface FindStocksDTO {
    productUID?: string;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<StockEntity, "quantity" | "minimumStock" | "createdAt">;

    order?: "asc" | "desc";
}
