import { AppError } from "@/shared/errors/app.error";

export class InvalidFlockBreedQuantityError extends AppError {
    constructor(message: string) {
        super(message);

        this.name = "InvalidFlockBreedQuantityError";
    }
}
