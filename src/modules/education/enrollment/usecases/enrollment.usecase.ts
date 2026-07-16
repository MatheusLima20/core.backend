import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { AppError } from "@/shared/errors/app.error";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { RepositoryHelper } from "@/shared/helpers/repository.helper";
import { FailureResult, Result, SuccessResult } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { CourseNotFoundError } from "../../course/errors/course-not-found.error";
import { ICourseRepository } from "../../course/repositories/course-repository.interface";
import { CreateEnrollmentDTO, CreateEnrollmentResponseDTO } from "../dtos/create-enrollment.dto";
import { EnrollmentResponseDTO } from "../dtos/enrollment-response.dto";
import { FindEnrollmentsDTO } from "../dtos/find-enrollments.dto";
import { UpdateEnrollmentDTO, UpdateEnrollmentResponseDTO } from "../dtos/update-enrollment.dto";
import { EnrollmentEntity } from "../entities/enrollment.entity";
import { EnrollmentProps } from "../entities/enrollment.props";
import { EnrollmentStatus } from "../enums/enrollment-status.enum";
import { EnrollmentAlreadyExistsError } from "../errors/enrollment-already-exists.error";
import { EnrollmentNotFoundError } from "../errors/enrollment-not-found.error";
import { EnrollmentMapper } from "../mappers/enrollment.mapper";
import { IEnrollmentRepository } from "../repositories/enrollment-repository.interface";

export class EnrollmentUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly enrollmentRepository: IEnrollmentRepository,
        private readonly courseRepository: ICourseRepository
    ) {}

    async create(data: CreateEnrollmentDTO): Promise<Result<CreateEnrollmentResponseDTO>> {
        const result = await this.courseRepository.findByUID(
            this.context.user.platformUID,
            data.courseUID
        );

        const course = RepositoryHelper.requireEntity(
            result,
            new CourseNotFoundError({ uid: data.courseUID })
        );

        if (!course.success) {
            return ResultFactory.failure(new PersistenceError("Failed to find course."));
        }

        const validation = await this.validateEnrollmentAlreadyExists(data.userUID, data.courseUID);

        if (!validation.success) {
            return validation;
        }

        const enrollment = new EnrollmentEntity({
            uid: randomUUID(),

            platformUID: this.context.user.platformUID,

            userUID: data.userUID,
            courseUID: data.courseUID,

            enrolledAt: data.enrolledAt ?? new Date(),
            expiresAt: data.expiresAt,

            status: EnrollmentStatus.ACTIVE,

            createdBy: this.context.user.uid,

            createdAt: data.createdAt ?? new Date(),
            updatedAt: data.updatedAt ?? new Date(),
        });

        const created = await this.enrollmentRepository.create(enrollment);

        if (!created.success) {
            return ResultFactory.failure(new PersistenceError("Failed to create enrollment."));
        }

        return ResultMapper.map(created, EnrollmentMapper.toCreatedResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<EnrollmentResponseDTO>> {
        const result = await this.enrollmentRepository.findByUID(
            this.context.user.platformUID,
            uid
        );

        const enrollment = ResultMapper.requireData(result, new EnrollmentNotFoundError(uid));

        return ResultMapper.map(enrollment, EnrollmentMapper.toResponseDTO);
    }

    async find(filters?: FindEnrollmentsDTO): Promise<Result<EnrollmentResponseDTO[]>> {
        const enrollments = await this.enrollmentRepository.find(
            this.context.user.platformUID,
            filters
        );

        return ResultMapper.map(enrollments, EnrollmentMapper.toResponseDTOList);
    }
    async update(data: UpdateEnrollmentDTO): Promise<Result<UpdateEnrollmentResponseDTO>> {
        const result = await this.enrollmentRepository.findByUID(
            this.context.user.platformUID,
            data.uid
        );

        if (!result.success) {
            return result;
        }

        const oldEnrollment = ResultMapper.requireData(
            result,
            new EnrollmentNotFoundError(data.uid)
        );

        if (!oldEnrollment.success) {
            return ResultFactory.failure(new EnrollmentNotFoundError(data.uid));
        }

        const userUID = data.userUID ?? oldEnrollment.data.userUID;
        const courseUID = data.courseUID ?? oldEnrollment.data.courseUID;

        if (userUID !== oldEnrollment.data.userUID || courseUID !== oldEnrollment.data.courseUID) {
            const course = await this.courseRepository.findByUID(
                this.context.user.platformUID,
                courseUID
            );
            const courseExists = RepositoryHelper.requireEntity(
                course,
                new CourseNotFoundError({ uid: data.courseUID })
            );

            if (!courseExists.success) {
                return ResultFactory.failure(new PersistenceError("Failed to find course."));
            }

            const validation = await this.validateEnrollmentAlreadyExists(
                userUID,
                courseUID,
                data.uid
            );

            if (!validation.success) {
                return validation;
            }
        }

        const completedAt =
            data.status === EnrollmentStatus.COMPLETED
                ? (oldEnrollment.data.completedAt ?? new Date())
                : (data.completedAt ?? oldEnrollment.data.completedAt);

        const mergedEnrollment = new EnrollmentEntity({
            ...oldEnrollment.data,

            ...data,

            completedAt,

            updatedBy: this.context.user.uid,

            updatedAt: new Date(),
        });

        const updated = await this.enrollmentRepository.update(mergedEnrollment);

        if (!updated.success) {
            return ResultFactory.failure(new PersistenceError("Failed to update enrollment."));
        }

        return ResultMapper.map(updated, EnrollmentMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const enrollment = await this.findByUID(uid);

        if (!enrollment.success) {
            return ResultFactory.failure(new EnrollmentNotFoundError(uid));
        }

        const deleted = await this.enrollmentRepository.delete(uid);

        if (!deleted.success) {
            return ResultFactory.failure(new PersistenceError("Failed to delete enrollment."));
        }

        return ResultFactory.ok();
    }

    private async validateEnrollmentAlreadyExists(
        userUID: string,
        courseUID: string,
        uid?: string
    ): Promise<FailureResult<AppError> | SuccessResult<EnrollmentProps | null>> {
        const result = await this.enrollmentRepository.find(this.context.user.platformUID, {
            userUID,
            courseUID,
        });

        if (isFailure(result)) {
            return result;
        }

        const duplicatedEnrollment = result.data.find((enrollment) => enrollment.uid !== uid);

        if (duplicatedEnrollment) {
            return ResultFactory.failure(new EnrollmentAlreadyExistsError());
        }

        return ResultFactory.success(result.data[0] ?? null);
    }
}
