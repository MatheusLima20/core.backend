import { StockEntity } from "../entities/stock.entity";

export type UpdateStockDTO = Partial<Pick<StockEntity, "quantity" | "minimumStock">> &
    Pick<StockEntity, "uid">;

export type UpdateStockResponseDTO = Pick<
    StockEntity,
    "uid" | "itemUID" | "quantity" | "minimumStock" | "updatedAt" | "updatedBy"
>;
