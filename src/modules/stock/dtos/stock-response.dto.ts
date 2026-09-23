import { StockEntity } from "../entities/stock.entity";

export type StockResponseDTO = Pick<
    StockEntity,
    | "uid"
    | "platformUID"
    | "productUID"
    | "quantity"
    | "minimumStock"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
