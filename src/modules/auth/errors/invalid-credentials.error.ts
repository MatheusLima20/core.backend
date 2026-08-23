import { AppError } from "@/shared/errors/app.error";

export class InvalidCredentialsError extends AppError {
    constructor() {
        super("Invalid credentials.");

        this.name = "InvalidCredentialsError";
    }
}
