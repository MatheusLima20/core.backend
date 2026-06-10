import { OrderItemProps } from "./order-item.props";


export class OrderItemEntity implements OrderItemProps {
    uid!: string;
    productUID!: string;
    orderUID!: string;
    platformUID!: string;
    unitPrice!: number;
    amount!: number;
    createdAt!: Date;
    updatedAt!:Date;
    

    constructor(props: OrderItemProps) {
        Object.assign(this, props);
    }

}
