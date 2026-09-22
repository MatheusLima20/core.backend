import { AppError } from "@/shared/errors/app.error";

export class CategoryNotFoundError extends AppError {
    constructor(item: { uid?: string }) {
        super(`Category '${item.uid}' not found.`);

        this.name = "CategoryNotFoundError";
    }
}
