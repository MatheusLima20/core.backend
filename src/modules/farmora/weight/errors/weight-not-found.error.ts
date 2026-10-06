import { AppError } from "@/shared/errors/app.error";

export class WeightNotFoundError extends AppError {
    constructor(uid: string) {
        super(`Weight '${uid}' not found.`);

        this.name = "WeightNotFoundError";
    }
}
