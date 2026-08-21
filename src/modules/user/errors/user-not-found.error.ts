import { AppError } from "@/shared/errors/app.error";

export class UserNotFoundError extends AppError {
    constructor(item: { uid?: string }) {
        super(`User '${item.uid}' not found.`);

        this.name = "UserNotFoundError";
    }
}
