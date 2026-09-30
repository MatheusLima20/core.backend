import { StockEntity } from "../entities/stock.entity";

export type CreateStockDTO = Pick<StockEntity, "itemUID" | "quantity" | "minimumStock">;

export type CreateStockResponseDTO = Pick<
    StockEntity,
    "uid" | "itemUID" | "quantity" | "minimumStock" | "createdAt" | "createdBy"
>;
