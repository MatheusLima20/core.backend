import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { InMemoryBreedRepository } from "@/modules/farmora/flock/breed/repositories/implementations/in-memory-breed.repository";
import { FlockStatus } from "@/modules/farmora/flock/flock/enums/flock-status.enum";
import { InMemoryFlockRepository } from "@/modules/farmora/flock/flock/repositories/implementations/in-memory-flock.repository";
import { FlockUsecase } from "@/modules/farmora/flock/flock/usecases/flock.usecase";
import { makeFlockUsecase } from "@/modules/farmora/flock/flock/usecases/tests/factories/flock-usecase.factory";
import { setupFlock } from "@/modules/farmora/flock/flock/usecases/tests/setup/flock-tests.setup";
import { InMemoryFlockBreedRepository } from "@/modules/farmora/flock/flock-breed/repositories/implementations/in-memory-flock-breed.repository";
import { FlockBreedUsecase } from "@/modules/farmora/flock/flock-breed/usecases/flock-breed.usecase";
import { BaseTestTransactionContext } from "@/shared/tests/base-test.interface";

import { InMemoryEggProductionRepository } from "../../../repositories/implementations/in-memory-egg-production.repository";
import { EggProductionUsecase } from "../../egg-production.usecase";
import { makeEggProductionUsecase } from "../factories/egg-production-usecase.factory";

export class TestBuilder {
    private testContext = new BaseTestTransactionContext();

    private flockUsecases: FlockUsecase[] = [];
    private flockBreedUsecases: FlockBreedUsecase[] = [];
    private eggProductionUsecases: EggProductionUsecase[] = [];

    private flockRepository = new InMemoryFlockRepository();
    private flockBreedRepository = new InMemoryFlockBreedRepository();
    private breedRepository = new InMemoryBreedRepository();

    private eggProductionRepository = new InMemoryEggProductionRepository(
        this.flockRepository,
        this.flockBreedRepository
    );

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

    async loadFlocks() {
        const flockUsecase = this.flockUsecases[0];

        await setupFlock(flockUsecase, {
            name: "Flock 1",
            status: FlockStatus.IN_PRODUCTION,
            birthDate: new Date("2026-01-01"),
        });

        await setupFlock(flockUsecase, {
            name: "Flock 2",
            status: FlockStatus.IN_PRODUCTION,
            birthDate: new Date("2026-02-01"),
        });

        return this;
    }

    createUsecases() {
        this.flockUsecases = this.testContext.users.map(
            (user) => makeFlockUsecase(user, this.flockRepository).usecase
        );

        this.flockBreedUsecases = this.testContext.users.map(
            (user) =>
                new FlockBreedUsecase(
                    { user },
                    this.flockBreedRepository,
                    this.flockRepository,
                    this.breedRepository
                )
        );

        this.eggProductionUsecases = this.testContext.users.map(
            (user) =>
                makeEggProductionUsecase(
                    user,
                    this.eggProductionRepository,
                    this.flockRepository,
                    this.flockBreedRepository
                ).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            flockUsecases: this.flockUsecases,

            flockBreedUsecases: this.flockBreedUsecases,

            eggProductionUsecases: this.eggProductionUsecases,

            repositories: {
                user: this.testContext.userRepository,

                flock: this.flockRepository,

                breed: this.breedRepository,

                flockBreed: this.flockBreedRepository,

                eggProduction: this.eggProductionRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
