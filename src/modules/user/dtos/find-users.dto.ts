import { UserProps } from "../entities/user.props";

export interface FindUsersDTO {
    name?: string;

    email?: string;

    userType?: string;

    isActivated?: boolean;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<UserProps, "name" | "email" | "createdAt" | "updatedAt">;

    order?: "asc" | "desc";
}
