import { AppError } from "@/shared/errors/app.error";

export class UserAlreadyExistsError extends AppError {
    constructor(item: { name?: string }) {
        super(`User '${item.name}' already exists.`);

        this.name = "UserAlreadyExistsError";
    }
}
