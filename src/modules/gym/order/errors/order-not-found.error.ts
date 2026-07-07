import { AppError } from "@/shared/errors/app.error";

export class OrderNotFoundError extends AppError {
    constructor(order: { uid?: string; description?: string }) {
        super(
            order.uid
                ? `Order '${order.uid}' not found.`
                : `Order '${order.description}' not found.`,
        );

        this.name = "OrderNotFoundError";
    }
}
