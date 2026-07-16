import { InMemoryCourseRepository } from "@/modules/education/course/repositories/implementations/in-memory-course.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryEnrollmentRepository } from "../../../repositories/implementations/in-memory-enrollment.repository";
import { EnrollmentUsecase } from "../../enrollment.usecase";

export function makeEnrollmentUsecase(
    user: AuthUser,
    enrollmentRepository: InMemoryEnrollmentRepository,
    courseRepository: InMemoryCourseRepository
) {
    const context = { user };

    return {
        usecase: new EnrollmentUsecase(context, enrollmentRepository, courseRepository),
    };
}
