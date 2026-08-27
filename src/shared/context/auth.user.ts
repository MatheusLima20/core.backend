import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";

export interface AuthUser {
    uid: string;

    platformUID: string;

    membershipUID: string;

    role: MembershipRole;
}
