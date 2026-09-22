import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { CategoryProps } from "./category.props";

@Entity("categories")
export class CategoryEntity extends BaseEntity implements CategoryProps {
    private static prefix = "cat";

    @PrimaryColumn()
    uid!: string;

    @Column()
    platformUID!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description!: string | null;

    @Column()
    createdBy!: string;

    @Column({ nullable: true })
    updatedBy?: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    updatedAt!: Date;

    constructor(props?: CategoryProps) {
        super({
            uid: props?.uid,
            prefix: CategoryEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
