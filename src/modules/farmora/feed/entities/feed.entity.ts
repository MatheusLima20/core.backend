import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { FeedProps } from "./feed.props";

@Entity("feeds")
export class FeedEntity extends BaseEntity implements FeedProps {
    static prefix = "fed";

    @PrimaryColumn({
        type: "varchar",
        length: 40,
    })
    uid!: string;

    @Column({
        type: "varchar",
        length: 40,
    })
    platformUID!: string;

    @Column({
        type: "varchar",
        length: 255,
    })
    name!: string;

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

    constructor(props?: FeedProps) {
        super({
            uid: props?.uid,
            prefix: FeedEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
