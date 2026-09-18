import { AppError } from "@/shared/errors/app.error";

export class ContentNotFoundError extends AppError {
    constructor(item: { uid?: string }) {
        super(`Content '${item.uid}' not found.`);

        this.name = "ContentNotFoundError";
    }
}
