import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryCourseRepository } from "../../../repositories/implementations/in-memory-course.repository";
import { CourseUsecase } from "../../course.usecase";

export class TestContext {
    userRepository = new InMemoryUserRepository();
    courseRepository = new InMemoryCourseRepository();

    users: AuthUser[] = [];
    usecases: CourseUsecase[] = [];
}
