import { AppError } from "@/shared/errors/app.error";

export class DuplicateInventoryItemError extends AppError {
    constructor(item: { name: string; category: string; unit: string }) {
        super(
            `Inventory item '${item.name}' already exists in category '${item.category}' with unit '${item.unit}'.`
        );

        this.name = "DuplicateInventoryItemError";
    }
}
