import { AppError } from "@/shared/errors/app.error";

export class EnrollmentNotFoundError extends AppError {
    constructor(uid: string) {
        super(`Enrollment '${uid}' not found.`);

        this.name = "EnrollmentNotFoundError";
    }
}
