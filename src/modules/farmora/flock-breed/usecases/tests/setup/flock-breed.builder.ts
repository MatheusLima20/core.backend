import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { FlockEntity } from "@/modules/farmora/flock/entities/flock.entity";
import { FlockStatus } from "@/modules/farmora/flock/enums/flock-status.enum";
import { makeFlockUsecase } from "@/modules/farmora/flock/usecases/tests/factories/flock-usecase.factory";
import { isFailure } from "@/shared/result/result.guard";

import { makeFlockBreedUsecase } from "../factories/flock-breed-usecase.factory";
import { TestFlockBreedContext } from "./test-flock-breed.context";

export class TestBuilder {
    private testContext = new TestFlockBreedContext();

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
        const flocks = [
            new FlockEntity({
                uid: "flk-test-1",
                platformUID: "1",
                name: "Flock Test 1",
                status: FlockStatus.IN_PRODUCTION,
                birthDate: new Date("2026-01-01"),
                arrivalDate: new Date("2026-01-15"),
                description: "Flock used for tests.",
                createdBy: "user-1",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),

            new FlockEntity({
                uid: "flk-test-2",
                platformUID: "1",
                name: "Flock Test 2",
                status: FlockStatus.IN_PRODUCTION,
                birthDate: new Date("2026-02-01"),
                arrivalDate: new Date("2026-02-15"),
                description: "Flock used for tests.",
                createdBy: "user-1",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),

            new FlockEntity({
                uid: "flk-test-3",
                platformUID: "2",
                name: "Flock Test 3",
                status: FlockStatus.IN_PRODUCTION,
                birthDate: new Date("2026-03-01"),
                arrivalDate: new Date("2026-03-15"),
                description: "Flock used for tests.",
                createdBy: "user-2",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        ];

        for (const flock of flocks) {
            const result = await this.testContext.flockRepository.register(flock);

            if (isFailure(result)) {
                throw result.error;
            }
        }

        return this;
    }

    createUsecases() {
        this.testContext.flockUsecases = this.testContext.users.map(
            (user) =>
                makeFlockUsecase(
                    user,
                    this.testContext.flockRepository,
                    this.testContext.flockBreedRepository
                ).usecase
        );

        this.testContext.flockBreedUsecases = this.testContext.users.map(
            (user) =>
                makeFlockBreedUsecase(
                    user,
                    this.testContext.flockBreedRepository,
                    this.testContext.flockRepository,
                    this.testContext.breedRepository
                ).usecase
        );

        return this;
    }

    build() {
        return {
            users: this.testContext.users,

            flockUsecases: this.testContext.flockUsecases,

            flockBreedUsecases: this.testContext.flockBreedUsecases,

            repositories: {
                user: this.testContext.userRepository,

                membership: this.testContext.membershipRepository,

                flock: this.testContext.flockRepository,

                breed: this.testContext.breedRepository,

                flockBreed: this.testContext.flockBreedRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
