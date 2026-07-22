import { MembershipRole } from "../enums/membership-role.enum";
import { MembershipProps } from "./membership.props";

export class Membership implements MembershipProps {
    uid!: string;
    platformUID!: string;
    userUID!: string;
    role!: MembershipRole;
    createdAt!: Date;

    constructor(props: MembershipProps) {
        Object.assign(this, props);
    }
}
