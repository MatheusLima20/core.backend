import { AppError } from "@/shared/errors/app.error";

export class ProductNotFoundError extends AppError {
    constructor(item: { uid?: string }) {
        super(`Product '${item.uid}' not found.`);

        this.name = "ProductNotFoundError";
    }
}
