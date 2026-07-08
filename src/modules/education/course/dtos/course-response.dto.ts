import { CourseProps } from "../entities/course.props";

export type CourseResponseDTO = Pick<
    CourseProps,
    | "uid"
    | "platformUID"
    | "title"
    | "description"
    | "status"
    | "thumbnail"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
