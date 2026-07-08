import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateCourseDTO } from "../../dtos/create-course.dto";
import { CourseStatus } from "../../enums/course-status.enum";
import { CourseNotFoundError } from "../../errors/course-not-found.error";
import { CourseUsecase } from "../course.usecase";
import { setupCourse, setupCourses } from "./setup/course-test.setup";
import { scenario } from "./setup/test-factory";

describe("CourseUsecase - findByUID", () => {
    const dataCourse1: CreateCourseDTO = {
        title: "Node.js Fundamentals",
        description: "Learn Node.js from scratch.",
        thumbnail: "node.png",
        status: CourseStatus.DRAFT,
    };

    const dataCourse2: CreateCourseDTO = {
        title: "React Fundamentals",
        description: "Learn React from scratch.",
        thumbnail: "react.png",
        status: CourseStatus.PUBLISHED,
    };

    const makeCourse = (data?: Partial<CreateCourseDTO>): CreateCourseDTO => ({
        ...dataCourse1,
        ...data,
    });

    let usecaseUser1!: CourseUsecase;
    let usecaseUser2!: CourseUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find a course by uid", async () => {
        const [, , createdCourse] = await setupCourses(
            usecaseUser1,
            dataCourse1,
            dataCourse2,
            makeCourse({
                title: "Docker",
                description: "Master Docker.",
                thumbnail: "docker.png",
                status: CourseStatus.PUBLISHED,
            })
        );

        const foundCourse = expectSuccess(await usecaseUser1.findByUID(createdCourse.uid));

        expect(foundCourse).toMatchObject({
            uid: createdCourse.uid,
            title: createdCourse.title,
            description: createdCourse.description,
            thumbnail: createdCourse.thumbnail,
            status: createdCourse.status,
            platformUID: createdCourse.platformUID,
            createdBy: createdCourse.createdBy,
            createdAt: createdCourse.createdAt,
        });
    });

    test("Should return CourseNotFoundError when uid does not exist", async () => {
        expectFailure(await usecaseUser1.findByUID("invalid-uid"), CourseNotFoundError);
    });

    test("Should not find a course from another platform", async () => {
        const course = await setupCourse(usecaseUser1, dataCourse1);

        expectFailure(await usecaseUser2.findByUID(course.uid), CourseNotFoundError);
    });

    test("Should return all persisted course data", async () => {
        const course = await setupCourse(usecaseUser1, {
            title: "NestJS",
            description: "Complete NestJS course.",
            thumbnail: "nestjs.png",
            status: CourseStatus.PUBLISHED,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(course.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: course.uid,
                title: "NestJS",
                description: "Complete NestJS course.",
                thumbnail: "nestjs.png",
                status: CourseStatus.PUBLISHED,
                platformUID: user1.platformUID,
                createdBy: user1.uid,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );
        expect(found.createdBy).not.toEqual(user2.uid);
    });
});
