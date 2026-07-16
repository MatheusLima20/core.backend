import { EnrollmentStatus } from "../enums/enrollment-status.enum";
import { EnrollmentProps } from "./enrollment.props";

export class EnrollmentEntity implements EnrollmentProps {
    uid!: string;

    userUID!: string;
    courseUID!: string;
    platformUID!: string;

    enrolledAt!: Date;

    completedAt?: Date;
    expiresAt?: Date;

    status!: EnrollmentStatus;

    createdBy!: string;
    updatedBy?: string;

    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: EnrollmentEntity) {
        Object.assign(this, props);
    }
}
