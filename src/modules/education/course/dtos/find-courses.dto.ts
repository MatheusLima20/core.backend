import { CourseProps } from "../entities/course.props";
import { CourseStatus } from "../enums/course-status.enum";

export interface FindCoursesDTO {
    title?: string;
    description?: string;
    status?: CourseStatus;
    createdAt?: Date;
    updatedAt?: Date;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<CourseProps, "title" | "description" | "createdAt" | "updatedAt">;

    order?: "asc" | "desc";
}
