import { AppError } from "@/shared/errors/app.error";

export class EggProductionAlreadyRegisteredError extends AppError {
    constructor() {
        super("Egg production has already been registered for this flock on this date.");

        this.name = "EggProductionAlreadyRegisteredError";
    }
}
