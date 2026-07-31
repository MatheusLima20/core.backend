import { VaccinationErrorCode } from "./vaccination.error-code.enum";

export const VaccinationErrorMessage = {
    [VaccinationErrorCode.INVALID_QUANTITY]: "Vaccination quantity cannot exceed flock quantity.",

    [VaccinationErrorCode.INVALID_DATE]: "Vaccination date cannot be before flock creation date.",

    [VaccinationErrorCode.INVALID_VACCINE]: "Vaccination vaccine is required.",

    [VaccinationErrorCode.DUPLICATE]:
        "Vaccination already exists for this flock, vaccine and date.",
} as const;
