import { ProductProps } from "./product.props";

export class ProductEntity implements ProductProps {

    uid!: string;
    name!: string;
    description!: string;
    isForSale!: boolean;
    isOnSale!: boolean;
    platformUID!: string;
    amount!: number;
    currentPrice!: number;
    createdBy!: string;
    updatedBy!: string | null;
    createdAt!: Date;
    updatedAt!: Date;
    

    constructor(props: ProductProps) {
        Object.assign(this, props);
    }
    
}
