import { CourseUsecase } from "@/modules/education/course/usecases/course.usecase";
import { dataCourse1 } from "@/modules/education/course/usecases/tests/factory/course-data.factory";
import { setupCourse } from "@/modules/education/course/usecases/tests/setup/course-test.setup";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { EnrollmentNotFoundError } from "../../errors/enrollment-not-found.error";
import { EnrollmentUsecase } from "../enrollment.usecase";
import { dataEnrollment1 } from "./factory/enrollment-data.factory";
import { setupEnrollment, setupEnrollments } from "./setup/enrollment-test.setup";
import { scenario } from "./setup/test-factory";

describe("EnrollmentUsecase - delete", () => {
    let courseUsecaseUser1!: CourseUsecase;

    let usecaseUser1!: EnrollmentUsecase;
    let usecaseUser2!: EnrollmentUsecase;

    beforeEach(async () => {
        ({
            courseUsecases: [courseUsecaseUser1],

            enrollmentUsecases: [usecaseUser1, usecaseUser2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should delete an enrollment", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            courseUID: course.uid,
        });

        const before = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(enrollment.uid));

        const after = expectSuccess(await usecaseUser1.find());

        expect(before).toHaveLength(1);
        expect(after).toHaveLength(0);

        expectFailure(await usecaseUser1.findByUID(enrollment.uid), EnrollmentNotFoundError);
    });

    test("Should delete only selected enrollment", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const [enrollmentA, enrollmentB] = await setupEnrollments(
            usecaseUser1,
            {
                ...dataEnrollment1,
                courseUID: course.uid,
            },
            {
                ...dataEnrollment1,
                userUID: "another-user",
                courseUID: course.uid,
            }
        );

        expectSuccess(await usecaseUser1.delete(enrollmentA.uid));

        expectFailure(await usecaseUser1.findByUID(enrollmentA.uid), EnrollmentNotFoundError);

        const remaining = expectSuccess(await usecaseUser1.findByUID(enrollmentB.uid));

        expect(remaining.uid).toBe(enrollmentB.uid);
    });

    test("Should not delete an inexistent enrollment", async () => {
        expectFailure(await usecaseUser1.delete("invalid-enrollment"), EnrollmentNotFoundError);
    });

    test("Should not delete enrollment from another platform", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            courseUID: course.uid,
        });

        expectFailure(await usecaseUser2.delete(enrollment.uid), EnrollmentNotFoundError);

        expectSuccess(await usecaseUser1.findByUID(enrollment.uid));
    });

    test("Should delete one enrollment keeping remaining enrollments", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const [enrollmentA, enrollmentB, enrollmentC] = await setupEnrollments(
            usecaseUser1,
            {
                ...dataEnrollment1,
                courseUID: course.uid,
            },
            {
                ...dataEnrollment1,
                userUID: "user-2",
                courseUID: course.uid,
            },
            {
                ...dataEnrollment1,
                userUID: "user-3",
                courseUID: course.uid,
            }
        );

        expectSuccess(await usecaseUser1.delete(enrollmentB.uid));

        const enrollments = expectSuccess(await usecaseUser1.find());

        expect(enrollments).toHaveLength(2);

        expect(enrollments.map((enrollment) => enrollment.uid)).toEqual(
            expect.arrayContaining([enrollmentA.uid, enrollmentC.uid])
        );

        expectFailure(await usecaseUser1.findByUID(enrollmentB.uid), EnrollmentNotFoundError);
    });
});
