import { Column, Entity, PrimaryColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { FeedItemProps } from "./feed-item.props";

@Entity("feed_items")
export class FeedItemEntity extends BaseEntity implements FeedItemProps {
    static prefix = "fdi";

    @PrimaryColumn({
        type: "varchar",
        length: 40,
    })
    uid!: string;

    @Column({
        type: "varchar",
        length: 40,
    })
    feedUID!: string;

    @Column({
        type: "varchar",
        length: 40,
    })
    inventoryItemUID!: string;

    @Column({
        type: "decimal",
        precision: 5,
        scale: 2,
    })
    inclusionPercentage!: number;

    constructor(props?: FeedItemProps) {
        super({
            uid: props?.uid,
            prefix: FeedItemEntity.prefix,
        });

        if (props) {
            const { uid: _uid, ...data } = props;

            Object.assign(this, data);
        }
    }
}
