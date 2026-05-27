

export class ItemEntity {
    uid!: string;
    orderId!: string;
    platform!: number;
    name!: string;
    description!: string;
    value!: number;
    createdAt!: Date;
    updatedAt!:Date;
    

    constructor(props: ItemEntity) {
        Object.assign(this, props);
    }

}
