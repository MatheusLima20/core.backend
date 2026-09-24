import { StockEntity } from "../entities/stock.entity";

export interface StockWithProduct {
    stock: StockEntity;

    product: {
        name: string;
        description: string | null;
        price: number;
        content: {
            url: string;
        } | null;
    };
}
