import { AppError } from "@/shared/errors/app.error";

export class ContentNotFoundError extends AppError {
    constructor(content: { uid?: string; name?: string }) {
        super(
            content.uid
                ? `Content '${content.uid}' not found.`
                : `Content '${content.name}' not found.`
        );

        this.name = "ContentNotFoundError";
    }
}
