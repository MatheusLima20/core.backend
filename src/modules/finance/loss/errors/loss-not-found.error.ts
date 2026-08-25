import { AppError } from "@/shared/errors/app.error";

export class LossNotFoundError extends AppError {
    constructor(loss: { uid?: string; name?: string }) {
        super(loss.uid ? `Loss '${loss.uid}' not found.` : `Loss '${loss.name}' not found.`);

        this.name = "LossNotFoundError";
    }
}
