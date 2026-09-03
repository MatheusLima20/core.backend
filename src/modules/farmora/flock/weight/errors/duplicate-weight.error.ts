import { AppError } from "@/shared/errors/app.error";

interface DuplicateWeightErrorProps {
    flockUID: string;
    weighingDate: Date;
}

export class DuplicateWeightError extends AppError {
    constructor(data: DuplicateWeightErrorProps) {
        const weighingDate =
            data.weighingDate instanceof Date
                ? data.weighingDate.toISOString().split("T")[0]
                : data.weighingDate;

        super(`A weight record already exists for flock '${data.flockUID}' on '${weighingDate}'.`);

        this.name = "DuplicateWeightError";
    }
}
