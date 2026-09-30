import { StockEntity } from "../entities/stock.entity";

export type StockResponseDTO = Pick<
    StockEntity,
    | "uid"
    | "platformUID"
    | "itemUID"
    | "quantity"
    | "minimumStock"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
