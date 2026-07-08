import { CreateCourseDTO } from "../../../dtos/create-course.dto";
import { CourseStatus } from "../../../enums/course-status.enum";

export const dataCourse1: CreateCourseDTO = {
    title: "Node.js Fundamentals",
    description: "Learn Node.js",
    thumbnail: "node.png",
    status: CourseStatus.DRAFT,
};

export const dataCourse2: CreateCourseDTO = {
    title: "React Fundamentals",
    description: "Learn React",
    thumbnail: "react.png",
    status: CourseStatus.PUBLISHED,
};

export function makeCourse(data?: Partial<CreateCourseDTO>): CreateCourseDTO {
    return {
        ...dataCourse1,
        ...data,
    };
}
