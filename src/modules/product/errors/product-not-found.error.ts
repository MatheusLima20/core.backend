import { AppError } from "@/shared/errors/app.error";

export class ProductNotFoundError extends AppError {
    constructor(product: { uid?: string; name?: string }) {
        super(
            product.uid
                ? `Product '${product.uid}' not found.`
                : `Product '${product.name}' not found.`,
        );

        this.name = "ProductNotFoundError";
    }
}
