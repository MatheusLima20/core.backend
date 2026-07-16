import {
    dataCourse1,
    dataCourse2,
} from "@/modules/education/course/usecases/tests/factory/course-data.factory";
import { setupCourse } from "@/modules/education/course/usecases/tests/setup/course-test.setup";
import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { UpdateEnrollmentDTO } from "../../dtos/update-enrollment.dto";
import { EnrollmentStatus } from "../../enums/enrollment-status.enum";
import { EnrollmentUsecase } from "../enrollment.usecase";
import { dataEnrollment1, dataEnrollment2 } from "./factory/enrollment-data.factory";
import { setupEnrollment, setupEnrollments } from "./setup/enrollment-test.setup";
import { scenario } from "./setup/test-factory";

describe("EnrollmentUsecase - find", () => {
    let courseUsecaseUser1!: any;

    let usecaseUser1!: EnrollmentUsecase;
    let usecaseUser2!: EnrollmentUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;
    let user3!: AuthUser;

    beforeEach(async () => {
        ({
            courseUsecases: [courseUsecaseUser1],

            enrollmentUsecases: [usecaseUser1, usecaseUser2],

            users: [user1, user2, user3],
        } = (await scenario().loadUsers(["1", "2", "3"])).createUsecases().build());
    });

    test("Should find all platform enrollments", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        await setupEnrollments(
            usecaseUser1,
            {
                ...dataEnrollment1,
                courseUID: course.uid,
            },
            {
                ...dataEnrollment1,
                userUID: user2.uid,
                courseUID: course.uid,
            }
        );

        const enrollments = expectSuccess(await usecaseUser1.find());

        expect(
            enrollments.every((enrollment) => enrollment.platformUID === user1.platformUID)
        ).toBe(true);
    });

    test("Should return empty list when platform has no enrollments", async () => {
        const enrollments = expectSuccess(await usecaseUser2.find());

        expect(enrollments).toEqual([]);
    });

    test("Should filter enrollments by userUID", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        await setupEnrollments(
            usecaseUser1,
            {
                ...dataEnrollment1,
                userUID: user1.uid,
                courseUID: course.uid,
            },
            {
                ...dataEnrollment1,
                userUID: user2.uid,
                courseUID: course.uid,
            }
        );

        const enrollments = expectSuccess(
            await usecaseUser1.find({
                userUID: user1.uid,
            })
        );

        expect(enrollments).toHaveLength(1);

        expect(enrollments[0].userUID).toBe(user1.uid);
    });

    test("Should filter enrollments by courseUID", async () => {
        const courseA = await setupCourse(courseUsecaseUser1, dataCourse1);

        const courseB = await setupCourse(courseUsecaseUser1, dataCourse2);

        await setupEnrollments(
            usecaseUser1,
            {
                ...dataEnrollment1,
                courseUID: courseA.uid,
            },
            {
                ...dataEnrollment1,
                userUID: user2.uid,
                courseUID: courseB.uid,
            }
        );

        const enrollments = expectSuccess(
            await usecaseUser1.find({
                courseUID: courseA.uid,
            })
        );

        expect(enrollments).toHaveLength(1);

        expect(enrollments[0].courseUID).toBe(courseA.uid);
    });

    test("Should filter enrollments by status", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const [, enrollmentB] = await setupEnrollments(
            usecaseUser1,
            {
                ...dataEnrollment1,
                courseUID: course.uid,
            },
            {
                ...dataEnrollment1,
                userUID: user2.uid,
                courseUID: course.uid,
            }
        );

        const data: UpdateEnrollmentDTO = {
            uid: enrollmentB.uid,
            status: EnrollmentStatus.COMPLETED,
        };

        expectSuccess(await usecaseUser1.update(data));

        const enrollments = expectSuccess(
            await usecaseUser1.find({
                status: EnrollmentStatus.COMPLETED,
            })
        );

        expect(enrollments).toHaveLength(1);

        expect(enrollments[0].status).toBe(EnrollmentStatus.COMPLETED);
    });

    test("Should search enrollments by userUID and courseUID", async () => {
        const courseA = await setupCourse(courseUsecaseUser1, dataCourse1);

        const courseB = await setupCourse(courseUsecaseUser1, dataCourse2);

        await setupEnrollments(
            usecaseUser1,
            {
                ...dataEnrollment1,
                userUID: user1.uid,
                courseUID: courseA.uid,
            },
            {
                ...dataEnrollment1,
                userUID: user2.uid,
                courseUID: courseB.uid,
            }
        );

        const enrollments = expectSuccess(
            await usecaseUser1.find({
                userUID: user1.uid,
                courseUID: courseA.uid,
            })
        );

        expect(enrollments).toHaveLength(1);

        expect(enrollments[0]).toMatchObject({
            userUID: user1.uid,
            courseUID: courseA.uid,
        });
    });

    test("Should return empty when filters match nothing", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            courseUID: course.uid,
        });

        const enrollments = expectSuccess(
            await usecaseUser1.find({
                userUID: "invalid-user",
            })
        );

        expect(enrollments).toEqual([]);
    });

    test("Should order enrollments by enrolledAt ascending", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollmentA = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            courseUID: course.uid,
        });

        const enrollmentB = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user2.uid,
            courseUID: course.uid,
        });

        const enrollments = expectSuccess(
            await usecaseUser1.find({
                orderBy: "enrolledAt",
                order: "asc",
            })
        );

        expect(enrollments.map((enrollment) => enrollment.uid)).toEqual([
            enrollmentA.uid,
            enrollmentB.uid,
        ]);
    });

    test("Should order enrollments by enrolledAt descending", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollmentA = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            courseUID: course.uid,
            enrolledAt: new Date("2026-01-10"),
        });

        const enrollmentB = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user3.uid,
            courseUID: course.uid,
            enrolledAt: new Date("2026-05-10"),
        });

        const enrollments = expectSuccess(
            await usecaseUser1.find({
                orderBy: "enrolledAt",
                order: "desc",
            })
        );

        expect(enrollments.map((enrollment) => enrollment.uid)).toEqual([
            enrollmentB.uid,
            enrollmentA.uid,
        ]);
    });

    test("Should return first page", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const [enrollmentA, enrollmentB] = await setupEnrollments(
            usecaseUser1,
            {
                ...dataEnrollment1,
                courseUID: course.uid,
            },
            {
                ...dataEnrollment1,
                userUID: user2.uid,
                courseUID: course.uid,
            },
            {
                ...dataEnrollment1,
                userUID: "user-3",
                courseUID: course.uid,
            },
            {
                ...dataEnrollment1,
                userUID: "user-4",
                courseUID: course.uid,
            }
        );

        const enrollments = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(enrollments).toHaveLength(2);

        expect(enrollments.map((enrollment) => enrollment.uid)).toEqual([
            enrollmentA.uid,
            enrollmentB.uid,
        ]);
    });

    test("Should return second page", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const [, , enrollmentC, enrollmentD] = await setupEnrollments(
            usecaseUser1,
            {
                ...dataEnrollment1,
                userUID: "user-1",
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
            },
            {
                ...dataEnrollment1,
                userUID: "user-4",
                courseUID: course.uid,
            }
        );

        const enrollments = expectSuccess(
            await usecaseUser1.find({
                page: 2,
                limit: 2,
            })
        );

        expect(enrollments.map((enrollment) => enrollment.uid)).toEqual([
            enrollmentC.uid,
            enrollmentD.uid,
        ]);
    });

    test("Should return remaining enrollments on last page", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const [, , , , enrollmentE] = await setupEnrollments(
            usecaseUser1,
            {
                ...dataEnrollment1,
                userUID: "user-1",
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
            },
            {
                ...dataEnrollment1,
                userUID: "user-4",
                courseUID: course.uid,
            },
            {
                ...dataEnrollment1,
                userUID: "user-5",
                courseUID: course.uid,
            }
        );

        const enrollments = expectSuccess(
            await usecaseUser1.find({
                page: 3,
                limit: 2,
            })
        );

        expect(enrollments.map((enrollment) => enrollment.uid)).toEqual([enrollmentE.uid]);
    });

    test("Should return empty list when page does not exist", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        await setupEnrollments(
            usecaseUser1,
            {
                ...dataEnrollment1,
                courseUID: course.uid,
            },
            {
                ...dataEnrollment1,
                userUID: user2.uid,
                courseUID: course.uid,
            }
        );

        const enrollments = expectSuccess(
            await usecaseUser1.find({
                page: 5,
                limit: 10,
            })
        );

        expect(enrollments).toEqual([]);
    });

    test("Should filter and order enrollments", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollmentB = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
            enrolledAt: new Date("2026-03-10"),
        });

        const enrollmentA = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user3.uid,
            courseUID: course.uid,
            enrolledAt: new Date("2026-01-10"),
        });

        const enrollments = expectSuccess(
            await usecaseUser1.find({
                status: EnrollmentStatus.ACTIVE,
                orderBy: "enrolledAt",
                order: "asc",
            })
        );

        expect(enrollments.map((enrollment) => enrollment.uid)).toEqual([
            enrollmentA.uid,
            enrollmentB.uid,
        ]);
    });

    test("Should order before paginate", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: "user-a",
            courseUID: course.uid,
        });

        await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: "user-b",
            courseUID: course.uid,
        });

        const enrollmentC = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: "user-c",
            courseUID: course.uid,
        });

        const enrollmentD = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: "user-d",
            courseUID: course.uid,
        });

        const enrollments = expectSuccess(
            await usecaseUser1.find({
                orderBy: "enrolledAt",
                order: "asc",
                page: 2,
                limit: 2,
            })
        );

        expect(enrollments.map((enrollment) => enrollment.uid)).toEqual([
            enrollmentC.uid,
            enrollmentD.uid,
        ]);
    });

    test("Should filter, order and paginate enrollments", async () => {
        const course = await setupCourse(courseUsecaseUser1, dataCourse1);

        const enrollmentB = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user1.uid,
            courseUID: course.uid,
            enrolledAt: new Date("2026-01-10"),
        });

        const enrollmentA = await setupEnrollment(usecaseUser1, {
            ...dataEnrollment1,
            userUID: user3.uid,
            courseUID: course.uid,
            enrolledAt: new Date("2026-02-10"),
        });

        await setupEnrollment(usecaseUser1, {
            ...dataEnrollment2,
            userUID: user2.uid,
            courseUID: course.uid,
            enrolledAt: new Date("2026-04-10"),
        });

        const enrollments = expectSuccess(
            await usecaseUser1.find({
                status: EnrollmentStatus.ACTIVE,
                orderBy: "enrolledAt",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(enrollments.map((enrollment) => enrollment.uid)).toEqual([
            enrollmentB.uid,
            enrollmentA.uid,
        ]);
    });
});
