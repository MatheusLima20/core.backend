import { AppError } from "@/shared/errors/app.error";

export class CourseNotFoundError extends AppError {
    constructor(course: { uid?: string; name?: string }) {
        super(
            course.uid ? `Course '${course.uid}' not found.` : `Course '${course.name}' not found.`
        );

        this.name = "CourseNotFoundError";
    }
}
