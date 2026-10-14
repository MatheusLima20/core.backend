import { AppError } from "@/shared/errors/app.error";

interface DuplicateWeightErrorProps {
    flockName: string;
    weighingDate: Date;
}

export class DuplicateWeightError extends AppError {
    constructor(data: DuplicateWeightErrorProps) {
        const weighingDate =
            data.weighingDate instanceof Date
                ? data.weighingDate.toISOString().split("T")[0]
                : data.weighingDate;

        super(`A weight record already exists for flock '${data.flockName}' on '${weighingDate}'.`);

        this.name = "DuplicateWeightError";
    }
}
