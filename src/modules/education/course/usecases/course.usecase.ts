import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { AppError } from "@/shared/errors/app.error";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { FailureResult, Result, SuccessResult } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { CourseResponseDTO } from "../dtos/course-response.dto";
import { CreateCourseDTO, CreateCourseResponseDTO } from "../dtos/create-course.dto";
import { FindCoursesDTO } from "../dtos/find-courses.dto";
import { UpdateCourseDTO, UpdateCourseResponseDTO } from "../dtos/update-course.dto";
import { CourseEntity } from "../entities/course.entity";
import { CourseProps } from "../entities/course.props";
import { CourseAlreadyExistsError } from "../errors/course-already-exists.error";
import { CourseNotFoundError } from "../errors/course-not-found.error";
import { CourseMapper } from "../mappers/course.mapper";
import { ICourseRepository } from "../repositories/course-repository.interface";

export class CourseUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly courseRepository: ICourseRepository
    ) {}

    async create(data: CreateCourseDTO): Promise<Result<CreateCourseResponseDTO>> {
        const validation = await this.validateCourseAlreadyExists(data.title);

        if (!validation.success) {
            return validation;
        }

        const course = new CourseEntity({
            uid: randomUUID(),

            platformUID: this.context.user.platformUID,

            title: data.title,
            description: data.description,
            thumbnail: data.thumbnail,
            status: data.status,

            createdBy: this.context.user.uid,
            updatedBy: null,

            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const created = await this.courseRepository.create(course);

        if (!created.success) {
            return ResultFactory.failure(new PersistenceError("Failed to create course."));
        }

        return ResultMapper.map(created, CourseMapper.toCreatedResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<CourseResponseDTO>> {
        const result = await this.courseRepository.findByUID(this.context.user.platformUID, uid);

        const course = ResultMapper.requireData(
            result,
            new CourseNotFoundError({
                uid,
            })
        );

        return ResultMapper.map(course, CourseMapper.toResponseDTO);
    }

    async find(filters?: FindCoursesDTO): Promise<Result<CourseResponseDTO[]>> {
        const courses = await this.courseRepository.find(this.context.user.platformUID, filters);

        return ResultMapper.map(courses, CourseMapper.toResponseDTOList);
    }

    async update(data: UpdateCourseDTO): Promise<Result<UpdateCourseResponseDTO>> {
        const result = await this.courseRepository.findByUID(
            this.context.user.platformUID,
            data.uid
        );

        if (!result.success) {
            return result;
        }

        const oldCourse = ResultMapper.requireData(
            result,
            new CourseNotFoundError({
                uid: data.uid,
            })
        );

        if (!oldCourse.success) {
            return ResultFactory.failure(
                new CourseNotFoundError({
                    uid: data.uid,
                })
            );
        }

        if (data.title) {
            const validation = await this.validateCourseAlreadyExists(data.title, data.uid);

            if (!validation.success) {
                return validation;
            }
        }

        const mergedCourse = new CourseEntity({
            ...oldCourse.data,

            ...data,

            updatedBy: this.context.user.uid,

            updatedAt: new Date(),
        });

        const updated = await this.courseRepository.update(mergedCourse);

        return ResultMapper.map(updated, CourseMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const course = await this.findByUID(uid);

        if (!course.success) {
            return ResultFactory.failure(new CourseNotFoundError({ uid }));
        }

        const deleted = await this.courseRepository.delete(uid);

        if (!deleted.success) {
            return ResultFactory.failure(new PersistenceError("Failed to delete course."));
        }

        return ResultFactory.ok();
    }

    private async validateCourseAlreadyExists(
        title: string,
        uid?: string
    ): Promise<FailureResult<AppError> | SuccessResult<CourseProps | null>> {
        const result = await this.courseRepository.find(this.context.user.platformUID, {
            title,
        });

        if (isFailure(result)) {
            return result;
        }

        const [course] = result.data;

        if (course && course.uid !== uid) {
            return ResultFactory.failure(new CourseAlreadyExistsError(title));
        }

        return ResultFactory.success(course);
    }
}
