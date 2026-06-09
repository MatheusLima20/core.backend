

export interface ProductProps {
    uid: string;
    name: string;
    description: string;
    isForSale: boolean;
    isOnSale: boolean;
    platformUID: string,
    amount: number;
    price: number;
    createdBy: string;
    updatedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}
