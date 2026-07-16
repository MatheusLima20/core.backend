import { dataCourse1 } from "@/modules/education/course/usecases/tests/factory/course-data.factory";
import { setupCourse } from "@/modules/education/course/usecases/tests/setup/course-test.setup";
import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { UpdateEnrollmentDTO } from "../../dtos/update-enrollment.dto";
import { EnrollmentStatus } from "../../enums/enrollment-status.enum";
import { EnrollmentAlreadyExistsError } from "../../errors/enrollment-already-exists.error";
import { EnrollmentNotFoundError } from "../../errors/enrollment-not-found.error";
import { EnrollmentUsecase } from "../enrollment.usecase";
import { dataEnrollment1 } from "./factory/enrollment-data.factory";
import { setupEnrollment } from "./setup/enrollment-test.setup";
import { scenario } from "./setup/test-factory";

describe("EnrollmentUsecase - update", () => {
    let usecaseUser1!: EnrollmentUsecase;
    let usecaseUser2!: EnrollmentUsecase;

    let courseUsecaseUser1!: any;

    let user1!: AuthUser;
    let user2!: AuthUser;
    let user3!: AuthUser;

    beforeEach(async () => {
        ({
            enrollmentUsecases: [usecaseUser1, usecaseUser2],
            courseUsecases: [courseUsecaseUser1],
            users: [user1, user2, user3],
        } = (await scenario().loadUsers(["1", "2", "3"])).createUsecases().build());
    });

    test("Should update an enrollment", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
        });

        const data: UpdateEnrollmentDTO = {
            uid: enrollment.uid,
            status: EnrollmentStatus.COMPLETED,
            expiresAt: new Date("2028-01-01"),
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: enrollment.uid,
            status: data.status,
            completedAt: expect.any(Date),
            expiresAt: data.expiresAt,
            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(enrollment.uid));

        expect(found).toMatchObject({
            uid: enrollment.uid,
            status: data.status,
            updatedBy: user1.uid,
        });

        expect(found.updatedBy).not.toEqual(user2.uid);
    });

    test("Should update only status", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
        });

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: enrollment.uid,
                status: EnrollmentStatus.COMPLETED,
            })
        );

        expect(updated.userUID).toBe(enrollment.userUID);
        expect(updated.courseUID).toBe(enrollment.courseUID);
        expect(updated.status).toBe(EnrollmentStatus.COMPLETED);
    });

    test("Should update expiration date", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
        });

        const expiresAt = new Date("2030-01-01");

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: enrollment.uid,
                expiresAt,
            })
        );

        expect(updated.expiresAt).toEqual(expiresAt);
    });

    test("Should keep the same user and course", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
        });

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: enrollment.uid,
                status: EnrollmentStatus.COMPLETED,
            })
        );

        expect(updated.userUID).toBe(enrollment.userUID);
        expect(updated.courseUID).toBe(enrollment.courseUID);
    });

    test("Should not update duplicated enrollment", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
        });

        await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user3.uid,
            courseUID: course.uid,
        });

        expectFailure(
            await usecaseUser1.update({
                uid: enrollment.uid,
                userUID: user3.uid,
            }),
            EnrollmentAlreadyExistsError
        );
    });

    test("Should not update an inexistent enrollment", async () => {
        expectFailure(
            await usecaseUser1.update({
                uid: "invalid-enrollment",
                status: EnrollmentStatus.COMPLETED,
            }),
            EnrollmentNotFoundError
        );
    });

    test("Should not update enrollment from another platform", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
        });

        expectFailure(
            await usecaseUser2.update({
                uid: enrollment.uid,
                status: EnrollmentStatus.COMPLETED,
            }),
            EnrollmentNotFoundError
        );
    });

    test("Should complete an active enrollment", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
        });

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: enrollment.uid,
                status: EnrollmentStatus.COMPLETED,
            })
        );

        expect(updated.status).toBe(EnrollmentStatus.COMPLETED);
        expect(updated.completedAt).toEqual(expect.any(Date));
    });

    test("Should cancel an active enrollment", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollment = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
        });

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: enrollment.uid,
                status: EnrollmentStatus.CANCELLED,
            })
        );

        expect(updated.status).toBe(EnrollmentStatus.CANCELLED);
    });
});
