import { AppError } from "@/shared/errors/app.error";

export class EggProductionNotFoundError extends AppError {
    constructor(eggProduction: { uid?: string }) {
        super(`Egg production '${eggProduction.uid}' not found.`);

        this.name = "EggProductionNotFoundError";
    }
}
