import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { NutritionProps } from "./nutrition.props";

@Entity("nutritious")
export class NutritionEntity extends BaseEntity implements NutritionProps {
    static prefix = "nut";

    @PrimaryColumn({
        type: "varchar",
        length: 40,
    })
    uid!: string;

    @Column({
        type: "varchar",
        length: 100,
    })
    name!: string;

    @Column({
        type: "int",
    })
    startWeek!: number;

    @Column({
        type: "int",
    })
    endWeek!: number;

    @Column({
        type: "decimal",
        precision: 5,
        scale: 2,
    })
    minimumCrudeProtein!: number;

    @Column({
        type: "decimal",
        precision: 5,
        scale: 2,
    })
    maximumCrudeProtein!: number;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: true,
    })
    metabolizableEnergy?: number;

    @Column({
        type: "decimal",
        precision: 5,
        scale: 2,
        nullable: true,
    })
    crudeFiber?: number;

    @Column({
        type: "decimal",
        precision: 5,
        scale: 2,
        nullable: true,
    })
    calcium?: number;

    @Column({
        type: "decimal",
        precision: 5,
        scale: 2,
        nullable: true,
    })
    phosphorus?: number;

    @Column({
        type: "decimal",
        precision: 5,
        scale: 2,
        nullable: true,
    })
    sodium?: number;

    @Column({
        type: "decimal",
        precision: 5,
        scale: 2,
        nullable: true,
    })
    lysine?: number;

    @Column({
        type: "decimal",
        precision: 5,
        scale: 2,
        nullable: true,
    })
    methionine?: number;

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

    constructor(props?: NutritionProps) {
        super({
            uid: props?.uid,
            prefix: NutritionEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
