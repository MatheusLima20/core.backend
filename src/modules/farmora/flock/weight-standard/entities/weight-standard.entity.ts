import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { WeightStandardProps } from "./weight-standard.props";

@Entity("weight_standards")
export class WeightStandardEntity extends BaseEntity implements WeightStandardProps {
    static prefix = "wst";

    @PrimaryColumn({
        type: "varchar",
        length: 40,
    })
    uid!: string;

    @Column({
        type: "varchar",
        length: 100,
    })
    breed!: string;

    @Column({
        type: "int",
    })
    week!: number;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
    })
    minWeight!: number;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
    })
    targetWeight!: number;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
    })
    maxWeight!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    constructor(props?: WeightStandardProps) {
        super({
            uid: props?.uid,
            prefix: WeightStandardEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
