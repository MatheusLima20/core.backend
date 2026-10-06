import { AppError } from "@/shared/errors/app.error";

export class MortalityNotFoundError extends AppError {
    constructor(mortality: { uid?: string }) {
        super(`Mortality '${mortality.uid}' not found.`);

        this.name = "MortalityNotFoundError";
    }
}
