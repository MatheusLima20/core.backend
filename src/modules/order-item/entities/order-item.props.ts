

export interface OrderItemProps {
    uid: string;
    productUID: string;
    orderUID: string;
    platformUID: string;
    amount: number;
    unitPrice: number;
    createdAt: Date;
    updatedAt:Date;
}
