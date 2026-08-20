import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { PlatformCategory } from "../enum/platform.category-enum";
import { PlatformProps } from "./platform.props";

@Entity("platforms")
export class PlatformEntity implements PlatformProps {
    @PrimaryGeneratedColumn("uuid")
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

    constructor(props: PlatformEntity) {
        Object.assign(this, props);
    }
}
