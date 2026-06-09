import { ItemProps } from "./item.props";


export class ItemEntity implements ItemProps {
    uid!: string;
    orderUID!: string;
    platformUID!: string;
    name!: string;
    description!: string;
    isForSale!: boolean;
    value!: number;
    amount!: number;
    createdAt!: Date;
    updatedAt!:Date;
    

    constructor(props: ItemProps) {
        Object.assign(this, props);
    }

}
