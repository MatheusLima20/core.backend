import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { BreedPurpose } from "../enums/breed-origin.enum";
import { EggColor } from "../enums/egg-color.enum";
import { BreedProps } from "./breed.props";

@Entity("breeds")
export class BreedEntity extends BaseEntity implements BreedProps {
    static prefix = "brd";

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
        length: 255,
    })
    name!: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
    })
    scientificName?: string;

    @Column({
        type: "varchar",
        length: 50,
        nullable: true,
    })
    eggColor?: EggColor;

    @Column({
        type: "varchar",
        length: 50,
        nullable: true,
    })
    breedPurpose?: BreedPurpose;

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

    constructor(props?: BreedProps) {
        super({
            uid: props?.uid,
            prefix: BreedEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
