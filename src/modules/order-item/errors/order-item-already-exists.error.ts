import { AppError } from "@/shared/errors/app.error";

export class OrderItemAlreadyExistsError extends AppError {
    constructor(itemUID: string) {
        super(`Order Item '${itemUID}' already exists.`);

        this.name = "OrderItemAlreadyExistsError";
    }
}
