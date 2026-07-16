import { AppError } from "@/shared/errors/app.error";

export class EnrollmentAlreadyExistsError extends AppError {
    constructor() {
        super("Enrollment already exists.");

        this.name = "EnrollmentAlreadyExistsError";
    }
}
