import { Result } from "@/shared/result";

import { FindCoursesDTO } from "../dtos/find-courses.dto";
import { CourseProps } from "../entities/course.props";

export interface ICourseRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<CourseProps | null>>;
    find(platformUID: string, filters?: FindCoursesDTO): Promise<Result<CourseProps[]>>;
    create(user: CourseProps): Promise<Result<CourseProps>>;
    update(user: CourseProps): Promise<Result<CourseProps>>;
    delete(uid: string): Promise<Result<void>>;
}
