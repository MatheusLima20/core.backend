import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";

import { BaseTestTransactionContext } from "./base-test.interface";

export abstract class BaseTestBuilder<TContext extends BaseTestTransactionContext> {
    protected abstract testContext: TContext;

    async loadUsers(uids: string[]) {
        for (const uid of uids) {
            const user = await makeLoggedUser(
                this.testContext.userRepository,
                this.testContext.membershipRepository,
                uid
            );

            this.testContext.users.push(user);
        }

        return this;
    }
}
