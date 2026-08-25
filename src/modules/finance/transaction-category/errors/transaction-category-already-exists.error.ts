import { AppError } from "@/shared/errors/app.error";

export class TransactionCategoryAlreadyExistsError extends AppError {
    constructor(name: string) {
        super(`Transaction category '${name}' already exists.`);

        this.name = "TransactionCategoryAlreadyExistsError";
    }
}
