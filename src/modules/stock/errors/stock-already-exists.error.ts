import { AppError } from "@/shared/errors/app.error";

export class StockAlreadyExistsError extends AppError {
    constructor(item: { productUID?: string }) {
        super(`Stock for product '${item.productUID}' already exists.`);

        this.name = "StockAlreadyExistsError";
    }
}
