import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { TransactionType } from "../../transaction-category/enums/transaction.type";
import { TransactionSourceType } from "../enums/transaction-source.type";
import { TransactionProps } from "./transaction.props";

@Entity("transactions")
export class TransactionEntity extends BaseEntity implements TransactionProps {
    private static prefix = "trn";

    @PrimaryColumn({
        type: "varchar",
        length: 40,
    })
    uid!: string;

    @Column({
        type: "varchar",
        length: 40,
    })
    platformUID!: string;

    @Column({
        type: "varchar",
        length: 40,
    })
    categoryUID!: string;

    @Column({
        type: "enum",
        enum: TransactionType,
    })
    type!: TransactionType;

    @Column({
        type: "varchar",
        length: 255,
    })
    description!: string;

    @Column({
        type: "enum",
        enum: TransactionSourceType,
        nullable: true,
    })
    source?: TransactionSourceType;

    @Column({
        type: "varchar",
        length: 40,
        nullable: true,
    })
    sourceUID?: string;

    @Column({
        type: "decimal",
        precision: 14,
        scale: 2,
    })
    amount!: number;

    @Column({
        type: "timestamp",
    })
    occurredAt!: Date;

    @Column({
        type: "text",
        nullable: true,
    })
    notes?: string;

    @Column({
        type: "varchar",
        length: 40,
    })
    createdBy!: string;

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

    constructor(props?: TransactionProps) {
        super({
            uid: props?.uid,
            prefix: TransactionEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
