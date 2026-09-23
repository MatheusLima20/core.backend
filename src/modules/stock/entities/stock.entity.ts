import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { StockProps } from "./stock.props";

@Entity("stocks")
export class StockEntity extends BaseEntity implements StockProps {
    private static prefix = "stk";

    @PrimaryColumn()
    uid!: string;

    @Column()
    platformUID!: string;

    @Column()
    productUID!: string;

    @Column({
        type: "decimal",
        precision: 12,
        scale: 3,
        default: 0,
    })
    quantity!: number;

    @Column({
        type: "decimal",
        precision: 12,
        scale: 3,
        default: 0,
    })
    minimumStock!: number;

    @Column()
    createdBy!: string;

    @Column({ nullable: true })
    updatedBy?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    updatedAt!: Date;

    constructor(props?: StockProps) {
        super({
            uid: props?.uid,
            prefix: StockEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
