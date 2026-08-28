import { AppError } from "@/shared/errors/app.error";

export class FeedItemAlreadyExistsError extends AppError {
    constructor(item: { inventoryItemUID: string }) {
        super(`Inventory item '${item.inventoryItemUID}' is already associated with this feed.`);

        this.name = "FeedItemAlreadyExistsError";
    }
}
