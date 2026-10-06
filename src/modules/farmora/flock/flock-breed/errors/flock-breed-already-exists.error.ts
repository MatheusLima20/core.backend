import { AppError } from "@/shared/errors/app.error";

export class FlockBreedAlreadyExistsError extends AppError {
    constructor() {
        super("Flock breed already exists.");

        this.name = "FlockBreedAlreadyExistsError";
    }
}
