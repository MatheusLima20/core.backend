import { AppError } from "@/shared/errors/app.error";

export class TokenNotProvidedError extends AppError {
    constructor() {
        super("Authentication token not provided.");

        this.name = "TokenNotProvidedError";
    }
}
