import { EnrollmentProps } from "../entities/enrollment.props";

export type CreateEnrollmentDTO = Pick<EnrollmentProps, "userUID" | "courseUID" | "expiresAt"> &
    Partial<Pick<EnrollmentProps, "enrolledAt" | "completedAt" | "createdAt" | "updatedAt">>;

export type CreateEnrollmentResponseDTO = Pick<
    EnrollmentProps,
    | "uid"
    | "platformUID"
    | "userUID"
    | "courseUID"
    | "enrolledAt"
    | "completedAt"
    | "expiresAt"
    | "status"
    | "createdBy"
    | "createdAt"
    | "updatedAt"
>;
