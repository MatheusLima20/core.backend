import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryCourseRepository } from "../../../repositories/implementations/in-memory-course.repository";
import { CourseUsecase } from "../../course.usecase";

export function makeCourseUsecase(user: AuthUser, courseRepository: InMemoryCourseRepository) {
    const context = { user };

    return {
        usecase: new CourseUsecase(context, courseRepository),
    };
}
