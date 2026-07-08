import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CourseStatus } from "../../enums/course-status.enum";
import { CourseNotFoundError } from "../../errors/course-not-found.error";
import { CourseUsecase } from "../course.usecase";
import { dataCourse1, dataCourse2 } from "./factory/course-data.factory";
import { setupCourse, setupCourses } from "./setup/course-test.setup";
import { scenario } from "./setup/test-factory";

describe("CourseUsecase - delete", () => {
    let usecaseUser1!: CourseUsecase;
    let usecaseUser2!: CourseUsecase;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should delete a course", async () => {
        const course = await setupCourse(usecaseUser1, dataCourse1);

        const before = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(course.uid));

        const after = expectSuccess(await usecaseUser1.find());

        expect(before).toHaveLength(1);
        expect(after).toHaveLength(0);

        expectFailure(await usecaseUser1.findByUID(course.uid), CourseNotFoundError);
    });

    test("Should delete only selected course", async () => {
        const [courseA, courseB] = await setupCourses(usecaseUser1, dataCourse1, dataCourse2);

        expectSuccess(await usecaseUser1.delete(courseA.uid));

        expectFailure(await usecaseUser1.findByUID(courseA.uid), CourseNotFoundError);

        const remaining = expectSuccess(await usecaseUser1.findByUID(courseB.uid));

        expect(remaining.uid).toBe(courseB.uid);
    });

    test("Should not delete an inexistent course", async () => {
        expectFailure(await usecaseUser1.delete("invalid-course"), CourseNotFoundError);
    });

    test("Should not delete course from another platform", async () => {
        const course = await setupCourse(usecaseUser1, dataCourse1);

        expectFailure(await usecaseUser2.delete(course.uid), CourseNotFoundError);

        expectSuccess(await usecaseUser1.findByUID(course.uid));
    });

    test("Should delete one course keeping remaining courses", async () => {
        const [, courseB, courseC] = await setupCourses(usecaseUser1, dataCourse1, dataCourse2, {
            title: "Docker",
            description: "Docker course",
            thumbnail: "docker.png",
            status: CourseStatus.PUBLISHED,
        });

        expectSuccess(await usecaseUser1.delete(courseB.uid));

        const courses = expectSuccess(await usecaseUser1.find());

        expect(courses).toHaveLength(2);

        expect(courses.map((course) => course.uid)).toEqual(
            expect.arrayContaining([courseC.uid, courses.find((c) => c.uid !== courseC.uid)!.uid])
        );

        expectFailure(await usecaseUser1.findByUID(courseB.uid), CourseNotFoundError);
    });
});
