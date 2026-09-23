export interface StockProps {
    uid?: string;

    platformUID: string;

    productUID: string;

    quantity: number;

    minimumStock: number;

    createdBy: string;

    updatedBy?: string;

    createdAt: Date;

    updatedAt?: Date;
}
