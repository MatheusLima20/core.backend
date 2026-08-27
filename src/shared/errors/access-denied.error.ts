import { AppError } from "@/shared/errors/app.error";

export class AccessDeniedError extends AppError {
    constructor() {
        super("Access denied.");

        this.name = "AccessDeniedError";
    }
}
