import { AppError } from "@/shared/errors/app.error";

export class FlockNotFoundError extends AppError {
    constructor(flock: { uid?: string; name?: string }) {
        super(flock.uid ? `Flock '${flock.uid}' not found.` : `Flock '${flock.name}' not found.`);

        this.name = "FlockNotFoundError";
    }
}
