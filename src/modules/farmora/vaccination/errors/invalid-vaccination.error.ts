import { AppError } from "@/shared/errors/app.error";

import { VaccinationErrorMessage } from "../enums/vaccination.error.enum";
import { VaccinationErrorCode } from "../enums/vaccination.error-code.enum";

export class InvalidVaccinationError extends AppError {
    constructor(code: VaccinationErrorCode) {
        super(VaccinationErrorMessage[code]);

        this.name = "InvalidVaccinationError";
    }
}
