import { EnrollmentStatus } from "../enums/enrollment-status.enum";

export interface EnrollmentProps {
    uid: string;

    userUID: string;
    courseUID: string;

    platformUID: string;

    enrolledAt: Date;

    completedAt?: Date;
    expiresAt?: Date;

    status: EnrollmentStatus;

    createdBy: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
