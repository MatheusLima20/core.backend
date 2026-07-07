import { AppError } from "@/shared/errors/app.error";

export class OrderAlreadyExistsError extends AppError {
    constructor(name: string) {
        super(`Order '${name}' already exists.`);

        this.name = "OrderAlreadyExistsError";
    }
}
