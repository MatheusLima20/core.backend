import { AppError } from "@/shared/errors/app.error";

export class BreedAlreadyExistsError extends AppError {
    constructor(name: string) {
        super(`Breed '${name}' already exists.`);

        this.name = "BreedAlreadyExistsError";
    }
}
