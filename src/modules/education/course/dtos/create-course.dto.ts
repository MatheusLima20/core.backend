import { CourseProps } from "../entities/course.props";

export type CreateCourseDTO = Pick<CourseProps, "title" | "description" | "status" | "thumbnail">;

export type CreateCourseResponseDTO = Pick<
    CourseProps,
    | "uid"
    | "platformUID"
    | "title"
    | "description"
    | "status"
    | "thumbnail"
    | "createdBy"
    | "createdAt"
    | "updatedAt"
>;
