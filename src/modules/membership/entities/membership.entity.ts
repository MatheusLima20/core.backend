import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";

@Entity("memberships")
@Index("IDX_membership_user_platform", ["userUID", "platformUID"], { unique: true })
export class MembershipEntity {
    @PrimaryColumn({ type: "varchar", length: 36 })
    uid!: string;

    @Column({ type: "varchar", length: 36 })
    userUID!: string;

    @Column({ type: "varchar", length: 36 })
    platformUID!: string;

    @Column({
        type: "enum",
        enum: MembershipRole,
    })
    role!: MembershipRole;

    @CreateDateColumn()
    createdAt!: Date;
}
