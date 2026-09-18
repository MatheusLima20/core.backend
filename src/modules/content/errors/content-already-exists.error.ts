import { AppError } from "@/shared/errors/app.error";

export class ContentAlreadyExistsError extends AppError {
    constructor(item: { name?: string }) {
        super(`Content '${item.name}' already exists.`);

        this.name = "ContentAlreadyExistsError";
    }
}
