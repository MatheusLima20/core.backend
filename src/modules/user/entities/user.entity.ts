import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { Gender } from "../enum/gender.enum";
import { UserProps } from "./user.props";

@Entity("users")
export class UserEntity implements UserProps {
    @PrimaryColumn()
    uid!: string;

    @Column()
    name!: string;

    @Column({ type: "bigint", nullable: true })
    docNumberPerson!: number | null;

    @Column({ type: "bigint", nullable: true })
    docNumberBusiness!: number | null;

    @Column({
        type: "enum",
        enum: Gender,
    })
    gender!: Gender;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ default: true })
    isActivated!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true })
    createdBy?: string | null;

    @Column({ nullable: true })
    updatedBy?: string | null;

    constructor(props: UserEntity) {
        Object.assign(this, props);
    }
}
