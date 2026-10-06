import { AppError } from "@/shared/errors/app.error";

export class InvalidMortalityError extends AppError {
    constructor(quantity: number, flockQuantity: number) {
        super(`Mortality quantity (${quantity}) cannot exceed flock quantity (${flockQuantity}).`);

        this.name = "InvalidMortalityError";
    }
}
