import { AppError } from "@/shared/errors/app.error";

export class VaccinationNotFoundError extends AppError {
    constructor(uid: string) {
        super(`Vaccination '${uid}' not found.`);

        this.name = "VaccinationNotFoundError";
    }
}
