import { AppError } from "@/shared/errors/app.error";

export class PlatformAlreadyExistsError extends AppError {
    constructor(item: { name?: string }) {
        super(`Platform '${item.name}' already exists.`);

        this.name = "PlatformAlreadyExistsError";
    }
}
