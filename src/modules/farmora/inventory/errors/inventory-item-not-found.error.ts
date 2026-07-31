import { AppError } from "@/shared/errors/app.error";

export class InventoryItemNotFoundError extends AppError {
    constructor(item: { uid?: string }) {
        super(`Inventory item '${item.uid}' not found.`);

        this.name = "InventoryItemNotFoundError";
    }
}
