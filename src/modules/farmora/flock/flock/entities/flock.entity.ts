import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { FlockStatus } from "../enums/flock-status.enum";
import { FlockProps } from "./flock.props";

@Entity("flocks")
export class FlockEntity extends BaseEntity implements FlockProps {
    static prefix = "flk";

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
        type: "int",
    })
    quantity!: number;

    @Column({
        type: "varchar",
        length: 50,
    })
    status!: FlockStatus;

    @Column({
        type: "date",
        nullable: true,
    })
    birthDate?: Date;

    @Column({
        type: "date",
        nullable: true,
    })
    arrivalDate?: Date;

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

    constructor(props?: FlockProps) {
        super({
            uid: props?.uid,
            prefix: FlockEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
