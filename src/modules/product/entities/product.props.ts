export interface ProductProps {
    uid?: string;

    platformUID: string;

    categoryUID: string;

    contentUID?: string | null;

    name: string;

    description?: string | null;

    price: number;

    barcode?: string | null;

    sku?: string | null;

    active: boolean;

    createdBy?: string;

    updatedBy?: string | null;

    createdAt: Date;

    updatedAt?: Date;
}
