import { TransactionType } from "../enums/transaction.type";
import { TransactionSourceType } from "../enums/transaction-source.type";
import { TransactionProps } from "./transaction.props";

export class TransactionEntity implements TransactionProps {
    uid!: string;

    platformUID!: string;

    categoryUID!: string;

    type!: TransactionType;

    description!: string;

    source?: TransactionSourceType;

    sourceUID?: string;

    amount!: number;

    occurredAt!: Date;

    notes?: string;

    createdBy!: string;
    updatedBy?: string;

    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: TransactionProps) {
        Object.assign(this, props);
    }
}
