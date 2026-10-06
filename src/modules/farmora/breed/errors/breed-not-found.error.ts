import { AppError } from "@/shared/errors/app.error";

export class BreedNotFoundError extends AppError {
    constructor(breed: { uid?: string; name?: string }) {
        super(breed.uid ? `Breed '${breed.uid}' not found.` : `Breed '${breed.name}' not found.`);

        this.name = "BreedNotFoundError";
    }
}
