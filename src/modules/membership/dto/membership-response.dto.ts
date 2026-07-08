import { MembershipProps } from "../entities/membership.props";

export type MembershipResponseDTO = Pick<
    MembershipProps,
    "uid" | "userUID" | "platformUID" | "role" | "createdAt"
>;