import { AppError } from "@/shared/errors/app.error";

export class InvalidTokenError extends AppError {
    constructor() {
        super("Invalid token.");

        this.name = "InvalidTokenError";
    }
}
