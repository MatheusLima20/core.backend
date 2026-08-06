import { AppError } from "@/shared/errors/app.error";

import { WeightErrorCode } from "../enums/weight.error-code.enum";
import { WeightErrorMessage } from "../enums/weight.error-message";

export class InvalidWeightError extends AppError {
    constructor(code: WeightErrorCode) {
        super(WeightErrorMessage[code]);

        this.name = "InvalidWeightError";
    }
}
