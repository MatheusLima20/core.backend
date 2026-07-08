import { AuthUser } from "@/shared/context/auth.user";

import { CourseStatus } from "../../enums/course-status.enum";
import { CourseAlreadyExistsError } from "../../errors/course-already-exists.error";
import { CourseUsecase } from "../course.usecase";
import { dataCourse1, dataCourse2 } from "./factory/course-data.factory";
import { expectCreateCourseFailure, setupCourse } from "./setup/course-test.setup";
import { scenario } from "./setup/test-factory";

describe("CourseUsecase - create", () => {
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

    test("Should register a course", async () => {
        const [courseCreatedA, courseCreatedB] = await Promise.all([
            setupCourse(usecaseUser1, dataCourse1),
            setupCourse(usecaseUser2, dataCourse2),
        ]);

        expect(courseCreatedA).toMatchObject({
            title: dataCourse1.title,
            description: dataCourse1.description,
            thumbnail: dataCourse1.thumbnail,
            status: dataCourse1.status,

            platformUID: user1.platformUID,
            createdBy: user1.uid,

            uid: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });

        expect(courseCreatedB).toMatchObject({
            title: dataCourse2.title,
            description: dataCourse2.description,
            thumbnail: dataCourse2.thumbnail,
            status: dataCourse2.status,

            platformUID: user2.platformUID,
            createdBy: user2.uid,

            uid: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });

    test("Should allow same course title in different platforms", async () => {
        await setupCourse(usecaseUser1, dataCourse1);

        await setupCourse(usecaseUser2, dataCourse1);
    });

    test("Should not register duplicated course", async () => {
        await setupCourse(usecaseUser1, dataCourse1);

        await expectCreateCourseFailure(usecaseUser1, dataCourse1, CourseAlreadyExistsError);
    });

    test("Should register a course with thumbnail", async () => {
        const course = await setupCourse(usecaseUser1, dataCourse1);

        expect(course.thumbnail).toBe(dataCourse1.thumbnail);
    });

    test("Should register a course without thumbnail", async () => {
        const course = await setupCourse(usecaseUser1, {
            ...dataCourse1,
            thumbnail: undefined,
        });

        expect(course.thumbnail).toBeUndefined();
    });

    test("Should register a draft course", async () => {
        const course = await setupCourse(usecaseUser1, {
            ...dataCourse1,
            status: CourseStatus.DRAFT,
        });

        expect(course.status).toBe(CourseStatus.DRAFT);
    });

    test("Should register a published course", async () => {
        const course = await setupCourse(usecaseUser1, {
            ...dataCourse1,
            status: CourseStatus.PUBLISHED,
        });

        expect(course.status).toBe(CourseStatus.PUBLISHED);
    });

    test("Should register an archived course", async () => {
        const course = await setupCourse(usecaseUser1, {
            ...dataCourse1,
            status: CourseStatus.ARCHIVED,
        });

        expect(course.status).toBe(CourseStatus.ARCHIVED);
    });
});
