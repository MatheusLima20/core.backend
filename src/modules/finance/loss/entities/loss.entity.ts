import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { LossReason } from "../enums/loss-reason.enum";
import { LossProps } from "./loss.props";

@Entity("losses")
export class LossEntity extends BaseEntity implements LossProps {
    static prefix = "lss";

    @PrimaryColumn({
        type: "varchar",
        length: 40,
    })
    uid!: string;

    @Column({
        type: "varchar",
        length: 40,
        nullable: true,
    })
    platformUID?: string;

    @Column({
        type: "varchar",
        length: 40,
        nullable: true,
    })
    transactionUID?: string;

    @Column({
        type: "varchar",
        length: 40,
        nullable: true,
    })
    productUID?: string;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
    })
    quantity!: number;

    @Column({
        type: "decimal",
        precision: 12,
        scale: 2,
    })
    unitCost!: number;

    @Column({
        type: "decimal",
        precision: 14,
        scale: 2,
    })
    totalCost!: number;

    @Column({
        type: "enum",
        enum: LossReason,
    })
    reason!: LossReason;

    @Column({
        type: "text",
        nullable: true,
    })
    description?: string;

    @Column({
        type: "timestamp",
    })
    occurredAt!: Date;

    @Column({
        type: "varchar",
        length: 40,
        nullable: true,
    })
    createdBy?: string;

    @Column({
        type: "varchar",
        length: 40,
        nullable: true,
    })
    updatedBy?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    constructor(props?: LossProps) {
        super({
            uid: props?.uid,
            prefix: LossEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
