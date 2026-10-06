import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { FlockBreedProps } from "./flock-breed.props";

@Entity("flock_breeds")
export class FlockBreedEntity extends BaseEntity implements FlockBreedProps {
    static prefix = "fbr";

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
        length: 40,
    })
    flockUID!: string;

    @Column({
        type: "varchar",
        length: 40,
    })
    breedUID!: string;

    @Column({
        type: "int",
    })
    quantity!: number;

    @Column({
        type: "varchar",
        length: 40,
    })
    createdBy!: string;

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

    constructor(props?: FlockBreedProps) {
        super({
            uid: props?.uid,
            prefix: FlockBreedEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
