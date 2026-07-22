import { AppError } from "@/shared/errors/app.error";

export class TransactionNotFoundError extends AppError {
    constructor(transaction: { uid?: string; description?: string }) {
        super(
            transaction.uid
                ? `Transaction '${transaction.uid}' not found.`
                : `Transaction '${transaction.description}' not found.`
        );

        this.name = "TransactionNotFoundError";
    }
}
