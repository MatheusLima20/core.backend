import { AppError } from "@/shared/errors/app.error";

import { VaccinationErrorMessage } from "../enums/vaccination.error.enum";

export class DuplicateVaccinationError extends AppError {
    constructor(data: { flockUID: string; itemUID: string; vaccinationDate: Date }) {
        super(
            `${VaccinationErrorMessage.DUPLICATE} 
            Flock: '${data.flockUID}', 
            Vaccine: '${data.itemUID}', 
            Date: '${data.vaccinationDate.toISOString()}'.`
        );

        this.name = "DuplicateVaccinationError";
    }
}
