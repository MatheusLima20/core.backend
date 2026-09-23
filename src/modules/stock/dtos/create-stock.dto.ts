import { StockEntity } from "../entities/stock.entity";

export type CreateStockDTO = Pick<StockEntity, "productUID" | "quantity" | "minimumStock">;

export type CreateStockResponseDTO = Pick<
    StockEntity,
    "uid" | "productUID" | "quantity" | "minimumStock" | "createdAt" | "createdBy"
>;
