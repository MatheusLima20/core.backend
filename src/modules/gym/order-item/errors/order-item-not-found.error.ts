import { AppError } from "@/shared/errors/app.error";

export class OrderItemNotFoundError extends AppError {
    constructor(orderItem: { uid?: string }) {
        super(`Order Item '${orderItem.uid}' not found.`);

        this.name = "OrderItemNotFoundError";
    }
}
