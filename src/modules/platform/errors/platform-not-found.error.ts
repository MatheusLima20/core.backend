import { AppError } from "@/shared/errors/app.error";

export class PlatformNotFoundError extends AppError {
    constructor(item: { uid?: string }) {
        super(`Platform '${item.uid}' not found.`);

        this.name = "PlatformNotFoundError";
    }
}
