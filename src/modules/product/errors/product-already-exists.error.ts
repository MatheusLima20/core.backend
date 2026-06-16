import { AppError } from "@/shared/errors/app.error";

export class ProductAlreadyExistsError extends AppError {
    constructor(name: string) {
        super(`Product '${name}' already exists.`);

        this.name = "ProductAlreadyExistsError";
    }
}
