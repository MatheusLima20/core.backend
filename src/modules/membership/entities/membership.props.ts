import { MembershipRole } from "../enums/membership-role.enum";

export interface MembershipProps {
    uid: string
    platformUID: string;
    userUID: string;
    role: MembershipRole;
    createdAt: Date;
}
