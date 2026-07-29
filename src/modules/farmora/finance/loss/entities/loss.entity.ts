import { LossReason } from "../enums/loss-reason.enum";
import { LossProps } from "./loss.props";

export class LossEntity implements LossProps {
    uid!: string;

    platformUID?: string;

    transactionUID?: string;

    productUID?: string;

    quantity!: number;

    unitCost!: number;

    totalCost!: number;

    reason!: LossReason;

    description?: string;

    occurredAt!: Date;

    createdBy?: string;
    updatedBy?: string;

    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: LossProps) {
        Object.assign(this, props);
    }
}
