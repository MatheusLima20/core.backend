import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";

import { makeCourseUsecase } from "../factory/course-usecase.factory";
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
        this.testContext.usecases = this.testContext.users.map(
            (user) => makeCourseUsecase(user, this.testContext.courseRepository).usecase
        );
        return this;
    }

    build() {
        return {
            users: this.testContext.users,
            usecases: this.testContext.usecases,
            repositories: {
                user: this.testContext.userRepository,
                course: this.testContext.courseRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
