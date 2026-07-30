import { AppError } from "@/shared/errors/app.error";

export class FlockAlreadyExistsError extends AppError {
    constructor(name?: string) {
        super(`Flock ${name} already exists.`);

        this.name = "FlockAlreadyExistsError";
    }
}
