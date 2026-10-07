import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { InMemoryBreedRepository } from "@/modules/farmora/breed/repositories/implementations/in-memory-breed.repository";
import { FlockEntity } from "@/modules/farmora/flock/entities/flock.entity";
import { FlockStatus } from "@/modules/farmora/flock/enums/flock-status.enum";
import { InMemoryFlockRepository } from "@/modules/farmora/flock/repositories/implementations/in-memory-flock.repository";
import { FlockUsecase } from "@/modules/farmora/flock/usecases/flock.usecase";
import { makeFlockUsecase } from "@/modules/farmora/flock/usecases/tests/factories/flock-usecase.factory";
import { FlockBreedEntity } from "@/modules/farmora/flock-breed/entities/flock-breed.entity";
import { InMemoryFlockBreedRepository } from "@/modules/farmora/flock-breed/repositories/implementations/in-memory-flock-breed.repository";
import { FlockBreedUsecase } from "@/modules/farmora/flock-breed/usecases/flock-breed.usecase";
import { isFailure } from "@/shared/result/result.guard";
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
            const result = await this.flockRepository.register(flock);

            if (isFailure(result)) {
                throw result.error;
            }
        }

        return this;
    }

    async loadFlockBreeds() {
        const flockBreeds = [
            new FlockBreedEntity({
                uid: "fbr-test-1",
                platformUID: "1",
                flockUID: "flk-test-1",
                breedUID: "brd_isa-brown",
                quantity: 100,
                createdBy: "user-1",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),

            new FlockBreedEntity({
                uid: "fbr-test-2",
                platformUID: "1",
                flockUID: "flk-test-1",
                breedUID: "brd-novogen-tinted",
                quantity: 80,
                createdBy: "user-1",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),

            new FlockBreedEntity({
                uid: "fbr-test-3",
                platformUID: "1",
                flockUID: "flk-test-1",
                breedUID: "brd-novogen-brown",
                quantity: 90,
                createdBy: "user-1",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),

            new FlockBreedEntity({
                uid: "fbr-test-4",
                platformUID: "1",
                flockUID: "flk-test-2",
                breedUID: "brd-novogen-brown",
                quantity: 80,
                createdBy: "user-1",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),

            new FlockBreedEntity({
                uid: "fbr-test-5",
                platformUID: "2",
                flockUID: "flk-test-3",
                breedUID: "brd_isa-brown",
                quantity: 60,
                createdBy: "user-2",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        ];

        for (const flockBreed of flockBreeds) {
            const result = await this.flockBreedRepository.register(flockBreed);

            if (isFailure(result)) {
                throw result.error;
            }
        }

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
