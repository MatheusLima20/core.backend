import { AppError } from "@/shared/errors/app.error";

export class LossNotFoundError extends AppError {
    constructor() {
        super("Loss not found.");

        this.name = "LossNotFoundError";
    }
}
