import { OrderProps } from "./order.props";

export class OrderEntity implements OrderProps {

    uid!: string;
    platformUID!: string;
    description!: string;
    createdAt!: Date;
    updatedAt!: Date;    

    constructor(props: OrderProps) {
        Object.assign(this, props);
    }
    
}
