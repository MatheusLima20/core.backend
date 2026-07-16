import { EnrollmentProps } from "../entities/enrollment.props";
import { EnrollmentStatus } from "../enums/enrollment-status.enum";

export interface FindEnrollmentsDTO {
    uid?: string;

    userUID?: string;
    courseUID?: string;

    status?: EnrollmentStatus;

    createdAt?: Date;
    updatedAt?: Date;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        EnrollmentProps,
        "enrolledAt" | "completedAt" | "expiresAt" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
