import { OrderProps } from "./order.props";

export class OrderEntity implements OrderProps {
    uid!: string;
    platformUID!: string;
    description!: string;
    createdBy!: string;
    updatedBy!: string | null;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: OrderProps) {
        Object.assign(this, props);
    }
}
