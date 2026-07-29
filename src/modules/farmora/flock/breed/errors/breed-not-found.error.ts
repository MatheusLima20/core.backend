import { AppError } from "@/shared/errors/app.error";

export class BreedNotFoundError extends AppError {
    constructor() {
        super("Breed not found.");

        this.name = "BreedNotFoundError";
    }
}
