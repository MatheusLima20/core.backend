import { AppError } from "@/shared/errors/app.error";

export class ContentAlreadyExistsError extends AppError {
    constructor(name: string) {
        super(`Content '${name}' already exists.`);

        this.name = "ContentAlreadyExistsError";
    }
}
