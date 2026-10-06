import { InventoryItemUsecase } from "@/modules/farmora/inventory/usecases/inventory-item.usecase";
import { inventoryItem1 } from "@/modules/farmora/inventory/usecases/tests/factories/inventory-item.factory";
import { setupInventoryItem } from "@/modules/farmora/inventory/usecases/tests/setup/inventory-item.setup";
import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import {
    activeFlock,
    smallFlock,
} from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { VaccinationUsecase } from "../vaccination.usecase";
import { makeVaccination } from "./factory/vaccination.factory";
import { scenario } from "./setup/test-vaccination.builder";
import { setupVaccination, setupVaccinations } from "./setup/vaccination.setup";

describe("VaccinationUsecase - find", () => {
    let usecaseUser1!: VaccinationUsecase;
    let usecaseUser2!: VaccinationUsecase;

    let flockUsecaseUser1!: FlockUsecase;

    let inventoryItemUsecaseUser1!: InventoryItemUsecase;

    let user1!: AuthUser;

    let flock1!: Awaited<ReturnType<typeof setupFlock>>;

    let item1!: Awaited<ReturnType<typeof setupInventoryItem>>;

    beforeEach(async () => {
        ({
            vaccinationUsecases: [usecaseUser1, usecaseUser2],

            flockUsecases: [flockUsecaseUser1],

            inventoryItemUsecases: [inventoryItemUsecaseUser1],

            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        flock1 = await setupFlock(flockUsecaseUser1, activeFlock);

        item1 = await setupInventoryItem(inventoryItemUsecaseUser1, inventoryItem1);
    });

    test("Should find all platform vaccinations", async () => {
        await setupVaccinations(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
            }),
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                batch: "BATCH-002",
            })
        );

        const vaccinations = expectSuccess(await usecaseUser1.find());

        expect(
            vaccinations.data.every((vaccination) => vaccination.platformUID === user1.platformUID)
        ).toBe(true);
    });

    test("Should return empty list when platform has no vaccinations", async () => {
        const vaccinations = expectSuccess(await usecaseUser2.find());

        expect(vaccinations.data).toEqual([]);
    });

    test("Should filter vaccinations by item", async () => {
        const item2 = await setupInventoryItem(inventoryItemUsecaseUser1, {
            ...inventoryItem1,
            name: "Vitamin Vaccine",
        });

        await setupVaccinations(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
            }),
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item2.uid,
                applicationDate: new Date("2026-01-02"),
            })
        );

        const vaccinations = expectSuccess(
            await usecaseUser1.find({
                itemUID: item1.uid,
            })
        );

        expect(vaccinations.data).toHaveLength(1);

        expect(vaccinations.data[0].itemUID).toBe(item1.uid);
    });

    test("Should filter vaccinations by flock", async () => {
        const flock2 = await setupFlock(flockUsecaseUser1, smallFlock);

        await setupVaccinations(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                applicationDate: new Date("2026-01-01"),
            }),
            makeVaccination({
                flockUID: flock2.uid,
                itemUID: item1.uid,
                applicationDate: new Date("2026-01-02"),
            })
        );

        const vaccinations = expectSuccess(
            await usecaseUser1.find({
                flockUID: flock1.uid,
            })
        );

        expect(vaccinations.data).toHaveLength(1);

        expect(vaccinations.data[0].flockUID).toBe(flock1.uid);
    });

    test("Should filter vaccinations by batch", async () => {
        await setupVaccinations(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                batch: "A",
            }),
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                applicationDate: new Date("2026-01-02"),
                batch: "B",
            })
        );

        const vaccinations = expectSuccess(
            await usecaseUser1.find({
                batch: "A",
            })
        );

        expect(vaccinations.data).toHaveLength(1);

        expect(vaccinations.data[0].batch).toBe("A");
    });

    test("Should order vaccinations by application date descending", async () => {
        const first = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                applicationDate: new Date("2026-01-01"),
            })
        );

        const second = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                applicationDate: new Date("2026-01-02"),
            })
        );

        const vaccinations = expectSuccess(
            await usecaseUser1.find({
                orderBy: "applicationDate",
                order: "desc",
            })
        );

        expect(vaccinations.data.map((vaccination) => vaccination.uid)).toEqual([
            second.uid,
            first.uid,
        ]);
    });

    test("Should return first page", async () => {
        const vaccinationA = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
            })
        );

        const vaccinationB = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                applicationDate: new Date("2026-01-02"),
            })
        );

        await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                applicationDate: new Date("2026-01-03"),
            })
        );

        const vaccinations = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(vaccinations.data).toHaveLength(2);

        expect(vaccinations.data.map((vaccination) => vaccination.uid)).toEqual([
            vaccinationA.uid,
            vaccinationB.uid,
        ]);
    });

    test("Should filter, order and paginate vaccinations", async () => {
        const vaccinationB = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                batch: "A",
                applicationDate: new Date("2026-01-01"),
            })
        );

        const vaccinationA = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                batch: "A",
                applicationDate: new Date("2026-01-02"),
            })
        );

        await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                batch: "B",
                applicationDate: new Date("2026-01-03"),
            })
        );

        const vaccinations = expectSuccess(
            await usecaseUser1.find({
                batch: "A",
                orderBy: "applicationDate",
                order: "desc",
                page: 1,
                limit: 2,
            })
        );

        expect(vaccinations.data.map((vaccination) => vaccination.uid)).toEqual([
            vaccinationA.uid,
            vaccinationB.uid,
        ]);
    });
});
