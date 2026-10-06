import { AppError } from "@/shared/errors/app.error";

export class FlockBreedNotFoundError extends AppError {
    constructor(flockBreed: { uid?: string }) {
        super(
            flockBreed.uid ? `Flock breed '${flockBreed.uid}' not found.` : "Flock breed not found."
        );

        this.name = "FlockBreedNotFoundError";
    }
}
