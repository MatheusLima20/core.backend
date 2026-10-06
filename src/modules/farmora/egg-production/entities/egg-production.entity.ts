import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { EggProductionProps } from "./egg-production.props";

@Entity("egg_productions")
export class EggProductionEntity extends BaseEntity implements EggProductionProps {
    static prefix = "epr";

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
    productionDate!: Date;

    @Column({
        type: "int",
    })
    totalEggs!: number;

    @Column({
        type: "int",
        nullable: true,
    })
    crackedEggs?: number;

    @Column({
        type: "int",
        nullable: true,
    })
    dirtyEggs?: number;

    @Column({
        type: "int",
        nullable: true,
    })
    discardedEggs?: number;

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

    constructor(props?: EggProductionProps) {
        super({
            uid: props?.uid,
            prefix: EggProductionEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
