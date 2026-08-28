import { AppError } from "@/shared/errors/app.error";

export class InvalidFeedCompositionError extends AppError {
    constructor(composition: { total: number; expected?: number }) {
        super(
            `Invalid feed composition. The total inclusion percentage must be ${composition.expected ?? 100}%, but received ${composition.total}%.`
        );

        this.name = "InvalidFeedCompositionError";
    }
}
