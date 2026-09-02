import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { BaseEntity } from "@/shared/entities/base.entity";

import { VaccinationProps } from "./vaccination.props";

@Entity("vaccinations")
export class VaccinationEntity extends BaseEntity implements VaccinationProps {
    static prefix = "vcc";

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
        length: 40,
    })
    flockUID!: string;

    @Column({
        type: "varchar",
        length: 40,
    })
    itemUID!: string;

    @Column({
        type: "date",
    })
    applicationDate!: Date;

    @Column({
        type: "varchar",
        length: 100,
        nullable: true,
    })
    dose?: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: true,
    })
    batch?: string;

    @Column({
        type: "date",
        nullable: true,
    })
    nextDoseDate?: Date;

    @Column({
        type: "text",
        nullable: true,
    })
    notes?: string;

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

    constructor(props?: VaccinationProps) {
        super({
            uid: props?.uid,
            prefix: VaccinationEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
