import { EnrollmentProps } from "../entities/enrollment.props";

export type UpdateEnrollmentDTO = Pick<EnrollmentProps, "uid"> &
    Partial<
        Pick<EnrollmentProps, "userUID" | "courseUID" | "status" | "completedAt" | "expiresAt">
    >;

export type UpdateEnrollmentResponseDTO = Pick<
    EnrollmentProps,
    | "uid"
    | "platformUID"
    | "userUID"
    | "courseUID"
    | "enrolledAt"
    | "completedAt"
    | "expiresAt"
    | "status"
    | "updatedBy"
    | "updatedAt"
>;
