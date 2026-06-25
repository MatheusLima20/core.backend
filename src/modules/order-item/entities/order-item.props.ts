export interface OrderItemProps {
    uid: string;
    productUID: string;
    orderUID: string;
    platformUID: string;
    amount: number;
    unitPrice: number;
    createdBy: string;
    updatedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}
