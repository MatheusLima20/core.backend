import { AppError } from "@/shared/errors/app.error";

export class FeedNotFoundError extends AppError {
    constructor(feed: { uid?: string }) {
        super(`Feed '${feed.uid}' not found.`);

        this.name = "FeedNotFoundError";
    }
}
