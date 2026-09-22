import { AppError } from "@/shared/errors/app.error";

export class ProductAlreadyExistsError extends AppError {
    constructor(item: { name?: string }) {
        super(`Product '${item.name}' already exists.`);

        this.name = "ProductAlreadyExistsError";
    }
}
