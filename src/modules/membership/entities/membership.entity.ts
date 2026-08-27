import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";
import { BaseEntity } from "@/shared/entities/base.entity";

import { MembershipProps } from "./membership.props";

@Entity("memberships")
@Index("IDX_membership_user_platform", ["userUID", "platformUID"], {
    unique: true,
})
export class MembershipEntity extends BaseEntity implements MembershipProps {
    static prefix = "mbr";

    @PrimaryColumn({
        type: "varchar",
        length: 50,
    })
    uid!: string;

    @Column({
        type: "varchar",
        length: 50,
    })
    userUID!: string;

    @Column({
        type: "varchar",
        length: 50,
    })
    platformUID!: string;

    @Column({
        type: "enum",
        enum: MembershipRole,
    })
    role!: MembershipRole;

    @CreateDateColumn()
    createdAt!: Date;

    constructor(props?: MembershipProps) {
        super({
            uid: props?.uid,
            prefix: MembershipEntity.prefix,
        });

        if (props) {
            Object.assign(this, props);
        }
    }
}
