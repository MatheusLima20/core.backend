import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateCourseDTO } from "../../../dtos/create-course.dto";
import { CourseUsecase } from "../../course.usecase";

export async function setupCourses(usecase: CourseUsecase, ...courses: CreateCourseDTO[]) {
    return Promise.all(courses.map((course) => createCourseOrFail(usecase, course)));
}

export async function setupCourse(usecase: CourseUsecase, course: CreateCourseDTO) {
    return createCourseOrFail(usecase, course);
}

async function createCourseOrFail(usecase: CourseUsecase, dto: CreateCourseDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateCourseFailure<E extends AppError>(
    usecase: CourseUsecase,
    dto: CreateCourseDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
