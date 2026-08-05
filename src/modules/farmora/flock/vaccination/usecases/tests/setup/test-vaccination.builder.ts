import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { makeFlockUsecase } from "@/modules/farmora/flock/flock/usecases/tests/factories/flock-usecase.factory";
import { makeInventoryItemUsecase } from "@/modules/farmora/inventory/usecases/tests/factories/inventory-item-usecase";

import { makeVaccinationUsecase } from "../factory/vaccination-usecase.factory";
import { TestVaccinationContext } from "./test-vaccination.context";

export class TestBuilder {
    private testContext = new TestVaccinationContext();

    async loadUsers(uids: string[]) {
        for (const uid of uids) {
            const user = await makeLoggedUser(this.testContext.userRepository, uid);

            this.testContext.users.push(user);
        }

        return this;
    }

    createUsecases() {
        this.testContext.flockUsecases = this.testContext.users.map(
            (user) => makeFlockUsecase(user, this.testContext.flockRepository).usecase
        );

        this.testContext.inventoryItemUsecases = this.testContext.users.map(
            (user) =>
                makeInventoryItemUsecase(user, this.testContext.inventoryItemRepository).usecase
        );

        this.testContext.vaccinationUsecases = this.testContext.users.map(
            (user) =>
                makeVaccinationUsecase(
                    user,
                    this.testContext.vaccinationRepository,
                    this.testContext.flockRepository,
                    this.testContext.inventoryItemRepository
                ).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            flockUsecases: this.testContext.flockUsecases,

            vaccinationUsecases: this.testContext.vaccinationUsecases,

            inventoryItemUsecases: this.testContext.inventoryItemUsecases,

            repositories: {
                user: this.testContext.userRepository,

                flock: this.testContext.flockRepository,

                vaccination: this.testContext.vaccinationRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
