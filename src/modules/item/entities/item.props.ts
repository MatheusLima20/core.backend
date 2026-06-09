

export interface ItemProps {
    uid: string;
    orderUID: string;
    platformUID: string;
    name: string;
    description: string;
    isForSale: boolean;
    value: number;
    amount: number;
    createdAt: Date;
    updatedAt:Date;
}
