import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { ProductProps } from "./product.props";

@Entity("products")
export class ProductEntity extends BaseEntity implements ProductProps {
    private static prefix = "prd";

    @PrimaryColumn()
    uid!: string;

    @Column()
    platformUID!: string;

    @Column()
    categoryUID!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description!: string | null;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
    })
    price!: number;

    @Column({ nullable: true })
    contentUID?: string | null;

    @Column({ nullable: true })
    barcode?: string | null | undefined;

    @Column({ nullable: true })
    sku?: string | null;

    @Column({ default: true })
    active!: boolean;

    @Column()
    createdBy!: string;

    @Column({ nullable: true })
    updatedBy?: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    updatedAt!: Date;

    constructor(props?: ProductProps) {
        super({
            uid: props?.uid,
            prefix: ProductEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
