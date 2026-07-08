import { AppError } from "@/shared/errors/app.error";

export class CourseAlreadyExistsError extends AppError {
    constructor(name: string) {
        super(`Course '${name}' already exists.`);

        this.name = "CourseAlreadyExistsError";
    }
}
