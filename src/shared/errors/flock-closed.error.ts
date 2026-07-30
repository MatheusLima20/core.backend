import { AppError } from "@/shared/errors/app.error";

export class FlockClosedError extends AppError {
    constructor(name?: string) {
        super(name ? `Flock '${name}' is closed.` : "Flock is closed.");

        this.name = "FlockClosedError";
    }
}
