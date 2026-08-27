import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { PlatformCategory } from "../enum/platform.category-enum";
import { PlatformProps } from "./platform.props";

@Entity("platforms")
export class PlatformEntity extends BaseEntity implements PlatformProps {
    static prefix = "plt";

    @Column({
        type: "varchar",
        length: 255,
        primary: true,
    })
    uid!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    name!: string;

    @Column({
        type: "varchar",
        length: 255,
        unique: true,
    })
    slug!: string;

    @Column({
        type: "enum",
        enum: PlatformCategory,
    })
    category!: PlatformCategory;

    @Column({
        type: "boolean",
        default: true,
    })
    isActivated!: boolean;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
    })
    createdBy!: string | null;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
    })
    updatedBy!: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    constructor(props?: PlatformProps) {
        super({
            uid: props?.uid,
            prefix: PlatformEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
