import { CreateStockDTO } from "../../../dtos/create-stock.dto";

export const dataStock1 = (productUID: string): CreateStockDTO => ({
    productUID,
    quantity: 100,
    minimumStock: 20,
});

export const dataStock2 = (productUID: string): CreateStockDTO => ({
    productUID,
    quantity: 200,
    minimumStock: 30,
});

export function makeStock(productUID: string, data?: Partial<CreateStockDTO>): CreateStockDTO {
    return {
        ...dataStock1(productUID),
        ...data,
    };
}
