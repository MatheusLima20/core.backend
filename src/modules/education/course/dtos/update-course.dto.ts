import { CourseProps } from "../entities/course.props";

export type UpdateCourseDTO = Pick<
    CourseProps,
    "uid" | "title" | "description" | "status" | "thumbnail"
>;

export type UpdateCourseResponseDTO = Pick<
    CourseProps,
    | "uid"
    | "platformUID"
    | "title"
    | "description"
    | "status"
    | "thumbnail"
    | "updatedBy"
    | "updatedAt"
>;
