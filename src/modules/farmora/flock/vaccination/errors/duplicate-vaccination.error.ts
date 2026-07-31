import { AppError } from "@/shared/errors/app.error";

import { VaccinationErrorMessage } from "../enums/vaccination.error.enum";

export class DuplicateVaccinationError extends AppError {
    constructor(data: { flockUID: string; vaccineName: string; vaccinationDate: Date }) {
        super(
            `${VaccinationErrorMessage.DUPLICATE} 
            Flock: '${data.flockUID}', 
            Vaccine: '${data.vaccineName}', 
            Date: '${data.vaccinationDate.toISOString()}'.`
        );

        this.name = "DuplicateVaccinationError";
    }
}
