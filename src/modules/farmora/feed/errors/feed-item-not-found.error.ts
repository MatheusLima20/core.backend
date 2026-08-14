import { AppError } from "@/shared/errors/app.error";

export class FeedItemNotFoundError extends AppError {
    constructor(item: { uid?: string }) {
        super(`Feed item '${item.uid}' not found.`);

        this.name = "FeedItemNotFoundError";
    }
}
