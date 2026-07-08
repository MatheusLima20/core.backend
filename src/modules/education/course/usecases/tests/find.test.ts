import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { CourseStatus } from "../../enums/course-status.enum";
import { CourseUsecase } from "../course.usecase";
import { dataCourse1, dataCourse2, makeCourse } from "./factory/course-data.factory";
import { setupCourse, setupCourses } from "./setup/course-test.setup";
import { scenario } from "./setup/test-factory";

describe("CourseUsecase - find", () => {
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

    test("Should find all platform courses", async () => {
        await setupCourses(usecaseUser1, dataCourse1, dataCourse2);

        await setupCourse(
            usecaseUser2,
            makeCourse({
                title: "Laravel",
            })
        );

        const platform1Courses = expectSuccess(await usecaseUser1.find());

        const platform2Courses = expectSuccess(await usecaseUser2.find());

        expect(platform1Courses.every((course) => course.platformUID === user1.platformUID)).toBe(
            true
        );

        expect(platform2Courses.every((course) => course.platformUID === user2.platformUID)).toBe(
            true
        );
    });

    test("Should return empty list when platform has no courses", async () => {
        const courses = expectSuccess(await usecaseUser2.find());

        expect(courses).toEqual([]);
    });

    test("Should filter courses by title", async () => {
        await setupCourses(
            usecaseUser1,
            makeCourse({
                title: "Node.js",
            }),
            makeCourse({
                title: "React",
            }),
            makeCourse({
                title: "Advanced Node.js",
            })
        );

        const courses = expectSuccess(
            await usecaseUser1.find({
                title: "Node",
            })
        );

        expect(courses).toHaveLength(2);

        expect(courses.every((course) => course.title.includes("Node"))).toBe(true);
    });

    test("Should filter courses by description", async () => {
        await setupCourses(usecaseUser1, dataCourse1, {
            ...dataCourse2,
            description: "Frontend Development",
        });

        const courses = expectSuccess(
            await usecaseUser1.find({
                description: "Node",
            })
        );

        expect(courses).toHaveLength(1);
    });

    test("Should filter courses by status", async () => {
        await setupCourses(
            usecaseUser1,
            makeCourse({
                title: "Node",
                status: CourseStatus.PUBLISHED,
            }),
            makeCourse({
                title: "React",
                status: CourseStatus.DRAFT,
            }),
            makeCourse({
                title: "NestJS",
                status: CourseStatus.PUBLISHED,
            })
        );

        const courses = expectSuccess(
            await usecaseUser1.find({
                status: CourseStatus.PUBLISHED,
            })
        );

        expect(courses).toHaveLength(2);

        expect(courses.every((course) => course.status === CourseStatus.PUBLISHED)).toBe(true);
    });

    test("Should search courses by title and description", async () => {
        const [, , courseA, courseB] = await setupCourses(
            usecaseUser1,
            dataCourse1,
            dataCourse2,
            makeCourse({
                title: "Node Advanced",
                description: "Advanced backend",
            }),
            makeCourse({
                title: "Node Expert",
                description: "Advanced backend",
            })
        );

        const courses = expectSuccess(
            await usecaseUser1.find({
                title: "Node",
                description: "Advanced",
            })
        );

        expect(courses).toHaveLength(2);

        expect(courses).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: courseA.title,
                }),
                expect.objectContaining({
                    title: courseB.title,
                }),
            ])
        );
    });

    test("Should return empty when filters match nothing", async () => {
        await setupCourse(
            usecaseUser1,
            makeCourse({
                title: "React",
            })
        );

        const courses = expectSuccess(
            await usecaseUser1.find({
                title: "Laravel",
            })
        );

        expect(courses).toEqual([]);
    });

    test("Should order courses by title ascending", async () => {
        await setupCourses(
            usecaseUser1,
            makeCourse({
                title: "Node C",
            }),
            makeCourse({
                title: "Node A",
            }),
            makeCourse({
                title: "Node B",
            })
        );

        const courses = expectSuccess(
            await usecaseUser1.find({
                orderBy: "title",
                order: "asc",
            })
        );

        expect(courses.map((course) => course.title)).toEqual(["Node A", "Node B", "Node C"]);
    });

    test("Should order courses by title descending", async () => {
        await setupCourses(
            usecaseUser1,
            makeCourse({ title: "A" }),
            makeCourse({ title: "C" }),
            makeCourse({ title: "B" })
        );

        const courses = expectSuccess(
            await usecaseUser1.find({
                orderBy: "title",
                order: "desc",
            })
        );

        expect(courses.map((course) => course.title)).toEqual(["C", "B", "A"]);
    });

    test("Should return first page", async () => {
        const [courseA, courseB] = await setupCourses(
            usecaseUser1,
            makeCourse({ title: "A" }),
            makeCourse({ title: "B" }),
            makeCourse({ title: "C" }),
            makeCourse({ title: "D" }),
            makeCourse({ title: "E" }),
            makeCourse({ title: "F" }),
            makeCourse({ title: "G" })
        );

        const courses = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(courses).toHaveLength(2);

        expect(courses.map((course) => course.title)).toEqual([courseA.title, courseB.title]);
    });

    test("Should return second page", async () => {
        const [, , courseC, courseD] = await setupCourses(
            usecaseUser1,
            makeCourse({ title: "A" }),
            makeCourse({ title: "B" }),
            makeCourse({ title: "C" }),
            makeCourse({ title: "D" }),
            makeCourse({ title: "E" }),
            makeCourse({ title: "F" }),
            makeCourse({ title: "G" })
        );

        const courses = expectSuccess(
            await usecaseUser1.find({
                page: 2,
                limit: 2,
            })
        );

        expect(courses.map((course) => course.title)).toEqual([courseC.title, courseD.title]);
    });

    test("Should return remaining courses on last page", async () => {
        const [, , , , courseE] = await setupCourses(
            usecaseUser1,
            makeCourse({ title: "A" }),
            makeCourse({ title: "B" }),
            makeCourse({ title: "C" }),
            makeCourse({ title: "D" }),
            makeCourse({ title: "E" })
        );

        const courses = expectSuccess(
            await usecaseUser1.find({
                page: 3,
                limit: 2,
            })
        );

        expect(courses.map((course) => course.title)).toEqual([courseE.title]);
    });

    test("Should return empty list when page does not exist", async () => {
        await setupCourses(usecaseUser1, makeCourse(), makeCourse());

        const courses = expectSuccess(
            await usecaseUser1.find({
                page: 5,
                limit: 10,
            })
        );

        expect(courses).toEqual([]);
    });

    test("Should filter and order courses", async () => {
        const [courseB, , courseA] = await setupCourses(
            usecaseUser1,
            makeCourse({
                title: "Node B",
            }),
            makeCourse({
                title: "React",
            }),
            makeCourse({
                title: "Node A",
            })
        );

        const courses = expectSuccess(
            await usecaseUser1.find({
                title: "Node",
                orderBy: "title",
                order: "asc",
            })
        );

        expect(courses.map((course) => course.title)).toEqual([courseA.title, courseB.title]);
    });

    test("Should order before paginate", async () => {
        const [courseD, , , courseC] = await setupCourses(
            usecaseUser1,
            makeCourse({
                title: "Node D",
            }),
            makeCourse({
                title: "Node A",
            }),
            makeCourse({
                title: "Node E",
            }),
            makeCourse({
                title: "Node C",
            }),
            makeCourse({
                title: "Node B",
            })
        );

        const courses = expectSuccess(
            await usecaseUser1.find({
                orderBy: "title",
                order: "asc",
                page: 2,
                limit: 2,
            })
        );

        expect(courses.map((course) => course.title)).toEqual([courseC.title, courseD.title]);
    });

    test("Should filter, order and paginate courses", async () => {
        const [courseD, , , courseC] = await setupCourses(
            usecaseUser1,
            makeCourse({
                title: "Node D",
            }),
            makeCourse({
                title: "Node E",
            }),
            makeCourse({
                title: "Node A",
            }),
            makeCourse({
                title: "Node C",
            }),
            makeCourse({
                title: "Node B",
            })
        );

        const courses = expectSuccess(
            await usecaseUser1.find({
                title: "Node",
                orderBy: "title",
                order: "asc",
                page: 2,
                limit: 2,
            })
        );

        expect(courses.map((course) => course.title)).toEqual([courseC.title, courseD.title]);
    });
});
