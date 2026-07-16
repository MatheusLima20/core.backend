import { CourseUsecase } from "@/modules/education/course/usecases/course.usecase";
import {
    dataCourse1,
    dataCourse2,
} from "@/modules/education/course/usecases/tests/factory/course-data.factory";
import { setupCourse } from "@/modules/education/course/usecases/tests/setup/course-test.setup";
import { AuthUser } from "@/shared/context/auth.user";

import { EnrollmentStatus } from "../../enums/enrollment-status.enum";
import { EnrollmentAlreadyExistsError } from "../../errors/enrollment-already-exists.error";
import { EnrollmentUsecase } from "../enrollment.usecase";
import { dataEnrollment1, dataEnrollment2 } from "./factory/enrollment-data.factory";
import { expectCreateEnrollmentFailure, setupEnrollment } from "./setup/enrollment-test.setup";
import { scenario } from "./setup/test-factory";

describe("EnrollmentUsecase - create", () => {
    let courseUsecaseUser1!: CourseUsecase;
    let courseUsecaseUser2!: CourseUsecase;

    let enrollmentUsecaseUser1!: EnrollmentUsecase;
    let enrollmentUsecaseUser2!: EnrollmentUsecase;
    let enrollmentUsecaseUser3!: EnrollmentUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;
    let user3!: AuthUser;

    beforeEach(async () => {
        ({
            courseUsecases: [courseUsecaseUser1, courseUsecaseUser2],

            enrollmentUsecases: [
                enrollmentUsecaseUser1,
                enrollmentUsecaseUser2,
                enrollmentUsecaseUser3,
            ],

            users: [user1, user2, user3],
        } = (await scenario().loadUsers(["1", "2", "3"])).createUsecases().build());
    });

    test("Should register an enrollment", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(enrollmentUsecaseUser1, {
            ...dataEnrollment1,
            courseUID: course.uid,
            userUID: user1.uid,
        });

        expect(enrollment).toMatchObject({
            userUID: user1.uid,
            courseUID: course.uid,

            platformUID: user1.platformUID,
            createdBy: user1.uid,

            status: EnrollmentStatus.ACTIVE,

            uid: expect.any(String),

            enrolledAt: expect.any(Date),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });

    test("Should allow same enrollment data in different platforms", async () => {
        const courseUser1 = await setupCourse(courseUsecaseUser1, dataCourse1);

        const courseUser2 = await setupCourse(courseUsecaseUser2, dataCourse2);

        await setupEnrollment(enrollmentUsecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: courseUser1.uid,
        });

        await setupEnrollment(enrollmentUsecaseUser2, {
            ...dataEnrollment1,
            userUID: user2.uid,
            courseUID: courseUser2.uid,
        });
    });

    test("Should not register duplicated enrollment", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollmentData = {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
        };

        await setupEnrollment(enrollmentUsecaseUser1, enrollmentData);

        await expectCreateEnrollmentFailure(
            enrollmentUsecaseUser1,
            enrollmentData,
            EnrollmentAlreadyExistsError
        );
    });

    test("Should allow different users in same course", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        await setupEnrollment(enrollmentUsecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
        });

        await setupEnrollment(enrollmentUsecaseUser3, {
            ...dataEnrollment2,
            userUID: user3.uid,
            courseUID: course.uid,
        });
    });

    test("Should register enrollment with expiration date", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(enrollmentUsecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
        });

        expect(enrollment.expiresAt).toEqual(dataEnrollment1.expiresAt);
    });

    test("Should register enrollment without expiration date", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(enrollmentUsecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
            expiresAt: undefined,
        });

        expect(enrollment.expiresAt).toBeUndefined();
    });

    test("Should register enrollment as active", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(enrollmentUsecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
        });

        expect(enrollment.status).toBe(EnrollmentStatus.ACTIVE);
    });
});
