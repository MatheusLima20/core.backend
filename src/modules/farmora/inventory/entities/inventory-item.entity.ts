import { Column, Entity, PrimaryColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { InventoryCategory } from "../enums/inventory-category.enum";
import { InventoryUnit } from "../enums/inventory-unit.enum";
import { InventoryItemProps } from "./inventory-item.props";

@Entity("inventory_items")
export class InventoryItemEntity extends BaseEntity implements InventoryItemProps {
    static prefix = "inv";

    @PrimaryColumn({
        type: "varchar",
        length: 40,
    })
    uid!: string;

    @Column({
        type: "varchar",
        length: 40,
    })
    platformUID?: string;

    @Column({
        type: "varchar",
        length: 100,
    })
    name!: string;

    @Column({
        type: "enum",
        enum: InventoryCategory,
    })
    category!: InventoryCategory;

    @Column({
        type: "boolean",
    })
    trackStock!: boolean;

    @Column({
        type: "enum",
        enum: InventoryUnit,
    })
    unit!: InventoryUnit;

    @Column({
        type: "decimal",
        precision: 5,
        scale: 2,
        nullable: true,
    })
    crudeProtein?: number;

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
        precision: 10,
        scale: 2,
        nullable: true,
    })
    minimumStock?: number;

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

    @Column({
        type: "timestamp",
    })
    createdAt!: Date;

    @Column({
        type: "timestamp",
    })
    updatedAt!: Date;

    constructor(props?: InventoryItemProps) {
        super({
            uid: props?.uid,
            prefix: InventoryItemEntity.prefix,
        });

        if (props) {
            const { uid: _uid, ...data } = props;

            Object.assign(this, data);
        }
    }
}
