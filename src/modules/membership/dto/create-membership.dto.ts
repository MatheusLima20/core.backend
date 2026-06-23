import { MembershipProps } from "../entities/membership.props";

export type CreateMembershipDTO = Pick<
    MembershipProps,
    "platformUID" | "userUID"
> & {
    role?: MembershipProps["role"];
};
