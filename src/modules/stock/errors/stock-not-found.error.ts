import { AppError } from "@/shared/errors/app.error";

export class StockNotFoundError extends AppError {
    constructor(item: { uid?: string }) {
        super(`Stock '${item.uid}' not found.`);

        this.name = "StockNotFoundError";
    }
}
