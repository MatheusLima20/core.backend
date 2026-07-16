import { InMemoryCourseRepository } from "@/modules/education/course/repositories/implementations/in-memory-course.repository";
import { CourseUsecase } from "@/modules/education/course/usecases/course.usecase";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryEnrollmentRepository } from "../../../repositories/implementations/in-memory-enrollment.repository";
import { EnrollmentUsecase } from "../../enrollment.usecase";

export class TestContext {
    userRepository = new InMemoryUserRepository();

    courseRepository = new InMemoryCourseRepository();
    enrollmentRepository = new InMemoryEnrollmentRepository();

    users: AuthUser[] = [];

    courseUsecases: CourseUsecase[] = [];

    enrollmentUsecases: EnrollmentUsecase[] = [];
}
