import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateEnrollmentDTO } from "../../../dtos/create-enrollment.dto";
import { EnrollmentUsecase } from "../../enrollment.usecase";

export async function setupEnrollments(
    usecase: EnrollmentUsecase,
    ...enrollments: CreateEnrollmentDTO[]
) {
    return Promise.all(
        enrollments.map((enrollment) => createEnrollmentOrFail(usecase, enrollment))
    );
}

export async function setupEnrollment(usecase: EnrollmentUsecase, enrollment: CreateEnrollmentDTO) {
    return createEnrollmentOrFail(usecase, enrollment);
}

async function createEnrollmentOrFail(usecase: EnrollmentUsecase, dto: CreateEnrollmentDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateEnrollmentFailure<E extends AppError>(
    usecase: EnrollmentUsecase,
    dto: CreateEnrollmentDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
