import { AppError } from "@/shared/errors/app.error";

interface DuplicateWeightErrorProps {
    flockUID: string;
    weighingDate: Date;
}

export class DuplicateWeightError extends AppError {
    constructor(data: DuplicateWeightErrorProps) {
        super(
            `A weight record already exists for flock '${data.flockUID}' on '${data.weighingDate.toISOString()}'.`
        );

        this.name = "DuplicateWeightError";
    }
}
