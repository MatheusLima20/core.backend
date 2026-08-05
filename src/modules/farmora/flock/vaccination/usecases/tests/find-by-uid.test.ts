import { InventoryItemUsecase } from "@/modules/farmora/inventory/usecases/inventory-item.usecase";
import { inventoryItem1 } from "@/modules/farmora/inventory/usecases/tests/factories/inventory-item.factory";
import { setupInventoryItem } from "@/modules/farmora/inventory/usecases/tests/setup/inventory-item.setup";
import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import { activeFlock } from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { VaccinationUsecase } from "../vaccination.usecase";
import { makeVaccination, vaccination1 } from "./factory/vaccination.factory";
import { scenario } from "./setup/test-vaccination.builder";
import { setupVaccination } from "./setup/vaccination.setup";

describe("VaccinationUsecase - findByUID", () => {
    let usecaseUser1!: VaccinationUsecase;
    let usecaseUser2!: VaccinationUsecase;

    let flockUsecaseUser1!: FlockUsecase;

    let inventoryItemUsecaseUser1!: InventoryItemUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let flock1!: Awaited<ReturnType<typeof setupFlock>>;

    let item1!: Awaited<ReturnType<typeof setupInventoryItem>>;

    beforeEach(async () => {
        ({
            vaccinationUsecases: [usecaseUser1, usecaseUser2],

            flockUsecases: [flockUsecaseUser1],

            inventoryItemUsecases: [inventoryItemUsecaseUser1],

            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        flock1 = await setupFlock(flockUsecaseUser1, activeFlock);

        item1 = await setupInventoryItem(inventoryItemUsecaseUser1, inventoryItem1);
    });

    test("Should find a vaccination by uid", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,

                itemUID: item1.uid,
            })
        );

        const found = expectSuccess(await usecaseUser1.findByUID(vaccination.uid));

        expect(found).toMatchObject({
            uid: vaccination.uid,

            flockUID: flock1.uid,

            itemUID: item1.uid,

            applicationDate: vaccination1.applicationDate,

            dose: vaccination1.dose,

            batch: vaccination1.batch,

            nextDoseDate: vaccination1.nextDoseDate,

            notes: vaccination1.notes,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            createdAt: expect.any(Date),

            updatedAt: expect.any(Date),
        });
    });

    test("Should return null when uid does not exist", async () => {
        const found = expectSuccess(await usecaseUser1.findByUID("invalid-uid"));

        expect(found).toBe(null);
    });

    test("Should not find a vaccination from another platform", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,

                itemUID: item1.uid,
            })
        );

        const found = expectSuccess(await usecaseUser2.findByUID(vaccination.uid));

        expect(found).toBe(null);
    });

    test("Should return all persisted vaccination data", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,

                itemUID: item1.uid,
            })
        );

        const found = expectSuccess(await usecaseUser1.findByUID(vaccination.uid));

        expect(found).toEqual(
            expect.objectContaining({
                uid: vaccination.uid,

                flockUID: flock1.uid,

                itemUID: item1.uid,

                applicationDate: vaccination1.applicationDate,

                dose: vaccination1.dose,

                batch: vaccination1.batch,

                nextDoseDate: vaccination1.nextDoseDate,

                notes: vaccination1.notes,

                platformUID: user1.platformUID,

                createdBy: user1.uid,

                updatedBy: undefined,

                createdAt: expect.any(Date),

                updatedAt: expect.any(Date),
            })
        );

        expect(found?.createdBy).not.toBe(user2.uid);
    });

    test("Should not return deleted vaccination", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,

                itemUID: item1.uid,
            })
        );

        await usecaseUser1.delete(vaccination.uid);

        const found = expectSuccess(await usecaseUser1.findByUID(vaccination.uid));

        expect(found).toBe(null);
    });
});
