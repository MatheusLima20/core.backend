import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { ContentType } from "../enums/content.type";
import { ContentProps } from "./content.props";

@Entity("contents")
export class ContentEntity extends BaseEntity implements ContentProps {
    private static prefix = "cnt";

    @PrimaryColumn()
    uid!: string;

    @Column()
    platformUID!: string;

    @Column({
        type: "enum",
        enum: ContentType,
    })
    type!: ContentType;

    @Column()
    url!: string;

    @Column({ nullable: true })
    alt!: string | null;

    @Column()
    name!: string;

    @Column({ nullable: true })
    mimeType!: string | null;

    @Column({ type: "integer", nullable: true })
    size!: number | null;

    @Column()
    createdBy!: string;

    @Column({ nullable: true })
    updatedBy?: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    updatedAt!: Date;

    constructor(props?: ContentProps) {
        super({
            uid: props?.uid,
            prefix: ContentEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
