import { AppError } from "@/shared/errors/app.error";

export class NutritionNotFoundError extends AppError {
    constructor(item: { uid?: string }) {
        super(`Nutrition '${item.uid}' not found.`);

        this.name = "NutritionNotFoundError";
    }
}
