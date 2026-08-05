import { VaccinationErrorCode } from "./vaccination.error-code.enum";

export const VaccinationErrorMessage = {
    [VaccinationErrorCode.INVALID_ITEM]: "Selected inventory item is not a valid vaccine.",

    [VaccinationErrorCode.DUPLICATE]:
        "Vaccination already exists for this flock, vaccine and date.",
} as const;
