import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { UpdateCourseDTO } from "../../dtos/update-course.dto";
import { CourseStatus } from "../../enums/course-status.enum";
import { CourseAlreadyExistsError } from "../../errors/course-already-exists.error";
import { CourseNotFoundError } from "../../errors/course-not-found.error";
import { CourseUsecase } from "../course.usecase";
import { dataCourse1, dataCourse2 } from "./factory/course-data.factory";
import { setupCourse, setupCourses } from "./setup/course-test.setup";
import { scenario } from "./setup/test-factory";

describe("CourseUsecase - update", () => {
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

    test("Should update a course", async () => {
        const course = await setupCourse(usecaseUser1, dataCourse1);

        const data: UpdateCourseDTO = {
            uid: course.uid,
            title: "Node.js Advanced",
            description: "Advanced Node.js concepts.",
            thumbnail: "node-advanced.png",
            status: CourseStatus.PUBLISHED,
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: course.uid,
            title: data.title,
            description: data.description,
            thumbnail: data.thumbnail,
            status: data.status,
            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(course.uid));

        expect(found).toMatchObject({
            uid: course.uid,
            title: data.title,
            description: data.description,
            thumbnail: data.thumbnail,
            status: data.status,
            updatedBy: user1.uid,
        });
        expect(found.updatedBy).not.toEqual(user2.uid);
    });

    test("Should update only description", async () => {
        const course = await setupCourse(usecaseUser1, dataCourse1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...course,
                description: "Updated description.",
            })
        );

        expect(updated.title).toBe(course.title);
        expect(updated.description).toBe("Updated description.");
        expect(updated.thumbnail).toBe(course.thumbnail);
        expect(updated.status).toBe(course.status);
    });

    test("Should update thumbnail", async () => {
        const course = await setupCourse(usecaseUser1, dataCourse1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...dataCourse1,
                uid: course.uid,
                thumbnail: "new-thumbnail.png",
            })
        );

        expect(updated.thumbnail).toBe("new-thumbnail.png");
        expect(updated.title).toBe(course.title);
    });

    test("Should update status", async () => {
        const course = await setupCourse(usecaseUser1, dataCourse1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...dataCourse1,
                uid: course.uid,
                status: CourseStatus.PUBLISHED,
            })
        );

        expect(updated.status).toBe(CourseStatus.PUBLISHED);
    });

    test("Should keep the same title", async () => {
        const course = await setupCourse(usecaseUser1, dataCourse1);

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...dataCourse1,
                uid: course.uid,
                description: "Updated description.",
            })
        );

        expect(updated.title).toBe(course.title);
    });

    test("Should not update duplicated course title", async () => {
        const [course] = await setupCourses(usecaseUser1, dataCourse1, dataCourse2);

        expectFailure(
            await usecaseUser1.update({
                ...dataCourse1,
                uid: course.uid,
                title: dataCourse2.title,
            }),
            CourseAlreadyExistsError
        );
    });

    test("Should not update an inexistent course", async () => {
        expectFailure(
            await usecaseUser1.update({
                ...dataCourse1,
                uid: "invalid-course",
                title: "Node.js",
            }),
            CourseNotFoundError
        );
    });

    test("Should not update course from another platform", async () => {
        const course = await setupCourse(usecaseUser1, dataCourse1);

        expectFailure(
            await usecaseUser2.update({
                ...dataCourse1,
                uid: course.uid,
                title: "Unauthorized update",
            }),
            CourseNotFoundError
        );
    });

    test("Should update draft course to published", async () => {
        const course = await setupCourse(usecaseUser1, {
            ...dataCourse1,
            status: CourseStatus.DRAFT,
        });

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...dataCourse1,
                uid: course.uid,
                status: CourseStatus.PUBLISHED,
            })
        );

        expect(updated.status).toBe(CourseStatus.PUBLISHED);
    });

    test("Should update published course to archived", async () => {
        const course = await setupCourse(usecaseUser1, {
            ...dataCourse1,
            status: CourseStatus.PUBLISHED,
        });

        const updated = expectSuccess(
            await usecaseUser1.update({
                ...dataCourse1,
                uid: course.uid,
                status: CourseStatus.ARCHIVED,
            })
        );

        expect(updated.status).toBe(CourseStatus.ARCHIVED);
    });
});
