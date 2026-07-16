import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { makeCourseUsecase } from "@/modules/education/course/usecases/tests/factory/course-usecase.factory";

import { makeEnrollmentUsecase } from "../factory/enrollment-usecase.factory";
import { TestContext } from "./test-context";

export class TestBuilder {
    private testContext = new TestContext();

    async loadUsers(uids: string[]) {
        for (const uid of uids) {
            const user = await makeLoggedUser(this.testContext.userRepository, uid);

            this.testContext.users.push(user);
        }

        return this;
    }

    createUsecases() {
        this.testContext.courseUsecases = this.testContext.users.map(
            (user) => makeCourseUsecase(user, this.testContext.courseRepository).usecase
        );

        this.testContext.enrollmentUsecases = this.testContext.users.map(
            (user) =>
                makeEnrollmentUsecase(
                    user,
                    this.testContext.enrollmentRepository,
                    this.testContext.courseRepository
                ).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            courseUsecases: this.testContext.courseUsecases,

            enrollmentUsecases: this.testContext.enrollmentUsecases,

            repositories: {
                user: this.testContext.userRepository,
                course: this.testContext.courseRepository,
                enrollment: this.testContext.enrollmentRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
