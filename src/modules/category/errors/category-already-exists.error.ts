import { AppError } from "@/shared/errors/app.error";

export class CategoryAlreadyExistsError extends AppError {
    constructor(item: { name?: string }) {
        super(`Category '${item.name}' already exists.`);

        this.name = "CategoryAlreadyExistsError";
    }
}
