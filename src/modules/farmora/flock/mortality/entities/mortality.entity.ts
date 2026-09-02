import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { MortalityCause } from "../enums/mortality-cause.enum";
import { MortalityProps } from "./mortality.props";

@Entity("mortalities")
export class MortalityEntity extends BaseEntity implements MortalityProps {
    static prefix = "mrt";

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
    mortalityDate!: Date;

    @Column({
        type: "int",
    })
    quantity!: number;

    @Column({
        type: "varchar",
        length: 50,
        nullable: true,
    })
    cause?: MortalityCause;

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

    constructor(props?: MortalityProps) {
        super({
            uid: props?.uid,
            prefix: MortalityEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
