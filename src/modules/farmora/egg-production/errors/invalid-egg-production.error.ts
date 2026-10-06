import { AppError } from "@/shared/errors/app.error";

export class InvalidEggProductionError extends AppError {
    constructor(totalEggs: number, flockQuantity: number) {
        super(
            `Invalid egg production. Total eggs (${totalEggs}) cannot be greater than flock quantity (${flockQuantity}).`
        );

        this.name = "InvalidEggProductionError";
    }
}
