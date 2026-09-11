import { MembershipRole } from "@/modules/membership/enums/membership-role.enum";

export interface LoginPlatformDTO {
    uid: string;
    name: string;
    slug: string;
    role: MembershipRole;
}

export interface LoginResponseDTO {
    token: string | null;
    user: {
        uid: string;
        name: string;
        email: string;
    };
    platforms: LoginPlatformDTO[];
}
