import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { TransactionType } from "../enums/transaction.type";
import { TransactionCategoryProps } from "./transaction-category.props";

@Entity("transaction_categories")
export class TransactionCategoryEntity extends BaseEntity implements TransactionCategoryProps {
    private static prefix = "trc";

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
        length: 100,
    })
    name!: string;

    @Column({
        type: "enum",
        enum: TransactionType,
    })
    type!: TransactionType;

    @Column({
        type: "varchar",
        length: 20,
        nullable: true,
    })
    color?: string;

    @Column({
        type: "text",
        nullable: true,
    })
    description?: string;

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

    constructor(props?: TransactionCategoryProps) {
        super({
            uid: props?.uid,
            prefix: TransactionCategoryEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
