import { CourseUsecase } from "@/modules/education/course/usecases/course.usecase";
import { dataCourse1 } from "@/modules/education/course/usecases/tests/factory/course-data.factory";
import { setupCourse } from "@/modules/education/course/usecases/tests/setup/course-test.setup";
import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { EnrollmentStatus } from "../../enums/enrollment-status.enum";
import { EnrollmentNotFoundError } from "../../errors/enrollment-not-found.error";
import { EnrollmentUsecase } from "../enrollment.usecase";
import { dataEnrollment1 } from "./factory/enrollment-data.factory";
import { setupEnrollment } from "./setup/enrollment-test.setup";
import { scenario } from "./setup/test-factory";

describe("EnrollmentUsecase - findByUID", () => {
    let courseUsecaseUser1!: CourseUsecase;

    let usecaseUser1!: EnrollmentUsecase;
    let usecaseUser2!: EnrollmentUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    beforeEach(async () => {
        ({
            courseUsecases: [courseUsecaseUser1],

            enrollmentUsecases: [usecaseUser1, usecaseUser2],

            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());
    });

    test("Should find an enrollment by uid", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
        });

        const foundEnrollment = expectSuccess(await usecaseUser1.findByUID(enrollment.uid));

        expect(foundEnrollment).toMatchObject({
            uid: enrollment.uid,

            userUID: user1.uid,
            courseUID: course.uid,

            platformUID: user1.platformUID,

            status: EnrollmentStatus.ACTIVE,

            createdBy: user1.uid,

            createdAt: enrollment.createdAt,
            updatedAt: enrollment.updatedAt,
        });
    });

    test("Should return EnrollmentNotFoundError when uid does not exist", async () => {
        expectFailure(await usecaseUser1.findByUID("invalid-uid"), EnrollmentNotFoundError);
    });

    test("Should not find an enrollment from another platform", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
        });

        expectFailure(await usecaseUser2.findByUID(enrollment.uid), EnrollmentNotFoundError);
    });

    test("Should return all persisted enrollment data", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
            expiresAt: new Date("2030-01-01"),
        });

        const found = expectSuccess(await usecaseUser1.findByUID(enrollment.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: enrollment.uid,

                userUID: user1.uid,
                courseUID: course.uid,

                platformUID: user1.platformUID,

                status: EnrollmentStatus.ACTIVE,

                expiresAt: new Date("2030-01-01"),

                createdBy: user1.uid,

                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );

        expect(found.createdBy).not.toEqual(user2.uid);
    });
});
