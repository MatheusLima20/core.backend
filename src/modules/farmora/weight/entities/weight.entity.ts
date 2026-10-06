import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { WeightProps } from "./weight.props";

@Entity("weights")
export class WeightEntity extends BaseEntity implements WeightProps {
    static prefix = "wgt";

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
    })
    flockUID!: string;

    @Column({
        type: "date",
    })
    weighingDate!: Date;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
    })
    averageWeight!: number;

    @Column({
        type: "int",
        nullable: true,
    })
    sampleSize?: number;

    @Column({
        type: "text",
        nullable: true,
    })
    notes?: string;

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

    constructor(props?: WeightProps) {
        super({
            uid: props?.uid,
            prefix: WeightEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
