import { TransactionType } from "../enums/transaction.type";
import { TransactionCategoryProps } from "./transaction-category.props";

export class TransactionCategoryEntity implements TransactionCategoryProps {
    uid!: string;

    name!: string;

    type!: TransactionType;

    color?: string;

    description?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: TransactionCategoryProps) {
        Object.assign(this, props);
    }
}
