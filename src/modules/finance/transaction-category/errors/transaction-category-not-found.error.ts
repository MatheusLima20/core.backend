import { AppError } from "@/shared/errors/app.error";

export class TransactionCategoryNotFoundError extends AppError {
    constructor(category: { uid?: string; name?: string }) {
        super(
            category.uid
                ? `Transaction category '${category.uid}' not found.`
                : `Transaction category '${category.name}' not found.`
        );

        this.name = "TransactionCategoryNotFoundError";
    }
}
