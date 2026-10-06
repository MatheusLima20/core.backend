import { InventoryCategory } from "@/modules/farmora/inventory/enums/inventory-category.enum";
import { InventoryItemUsecase } from "@/modules/farmora/inventory/usecases/inventory-item.usecase";
import { inventoryItem1 } from "@/modules/farmora/inventory/usecases/tests/factories/inventory-item.factory";
import { setupInventoryItem } from "@/modules/farmora/inventory/usecases/tests/setup/inventory-item.setup";
import { AuthUser } from "@/shared/context/auth.user";
import { FlockClosedError } from "@/shared/errors/flock-closed.error";
import { expectFailure } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import {
    activeFlock,
    closedFlock,
} from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { DuplicateVaccinationError } from "../../errors/duplicate-vaccination.error";
import { InvalidVaccinationError } from "../../errors/invalid-vaccination.error";
import { VaccinationUsecase } from "../vaccination.usecase";
import { makeVaccination, vaccination1 } from "./factory/vaccination.factory";
import { scenario } from "./setup/test-vaccination.builder";
import { setupVaccination } from "./setup/vaccination.setup";

describe("VaccinationUsecase - create", () => {
    let usecaseUser1!: VaccinationUsecase;
    let usecaseUser2!: VaccinationUsecase;

    let flockUsecaseUser1!: FlockUsecase;
    let flockUsecaseUser2!: FlockUsecase;

    let inventoryItemUsecaseUser1!: InventoryItemUsecase;
    let inventoryItemUsecaseUser2!: InventoryItemUsecase;

    let user1!: AuthUser;
    let user2!: AuthUser;

    let flock1!: Awaited<ReturnType<typeof setupFlock>>;
    let flock2!: Awaited<ReturnType<typeof setupFlock>>;

    let item1!: Awaited<ReturnType<typeof setupInventoryItem>>;
    let item2!: Awaited<ReturnType<typeof setupInventoryItem>>;

    beforeEach(async () => {
        ({
            vaccinationUsecases: [usecaseUser1, usecaseUser2],

            flockUsecases: [flockUsecaseUser1, flockUsecaseUser2],

            inventoryItemUsecases: [inventoryItemUsecaseUser1, inventoryItemUsecaseUser2],

            users: [user1, user2],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        flock1 = await setupFlock(flockUsecaseUser1, activeFlock);

        flock2 = await setupFlock(flockUsecaseUser2, activeFlock);

        item1 = await setupInventoryItem(inventoryItemUsecaseUser1, inventoryItem1);

        item2 = await setupInventoryItem(inventoryItemUsecaseUser2, inventoryItem1);
    });

    async function createVaccination(
        usecase: VaccinationUsecase,
        flockUID: string,
        itemUID: string
    ) {
        return setupVaccination(
            usecase,
            makeVaccination({
                flockUID,
                itemUID,
            })
        );
    }

    test("Should register vaccination", async () => {
        const vaccination = await createVaccination(usecaseUser1, flock1.uid, item1.uid);

        expect(vaccination).toMatchObject({
            flockUID: flock1.uid,

            itemUID: item1.uid,

            applicationDate: vaccination1.applicationDate,

            dose: vaccination1.dose,

            batch: vaccination1.batch,

            nextDoseDate: vaccination1.nextDoseDate,

            notes: vaccination1.notes,

            platformUID: user1.platformUID,

            createdBy: user1.uid,

            uid: expect.any(String),

            createdAt: expect.any(Date),
        });
    });

    test("Should register vaccinations in different platforms", async () => {
        const vaccinationUser1 = await createVaccination(usecaseUser1, flock1.uid, item1.uid);

        const vaccinationUser2 = await createVaccination(usecaseUser2, flock2.uid, item2.uid);

        expect(vaccinationUser1.platformUID).toBe(user1.platformUID);

        expect(vaccinationUser2.platformUID).toBe(user2.platformUID);
    });

    test("Should allow same vaccination date in different platforms", async () => {
        await createVaccination(usecaseUser1, flock1.uid, item1.uid);

        await createVaccination(usecaseUser2, flock2.uid, item2.uid);
    });

    test("Should not register duplicate vaccination", async () => {
        await createVaccination(usecaseUser1, flock1.uid, item1.uid);

        expectFailure(
            await usecaseUser1.create(
                makeVaccination({
                    flockUID: flock1.uid,
                    itemUID: item1.uid,
                })
            ),
            DuplicateVaccinationError
        );
    });

    test("Should not register vaccination for closed flock", async () => {
        const closed = await setupFlock(flockUsecaseUser1, closedFlock);

        expectFailure(
            await usecaseUser1.create(
                makeVaccination({
                    flockUID: closed.uid,
                    itemUID: item1.uid,
                })
            ),
            FlockClosedError
        );
    });

    test("Should not register vaccination with non vaccine inventory item", async () => {
        const feed = await setupInventoryItem(inventoryItemUsecaseUser1, {
            ...inventoryItem1,
            category: InventoryCategory.FEED,
        });

        expectFailure(
            await usecaseUser1.create(
                makeVaccination({
                    flockUID: flock1.uid,
                    itemUID: feed.uid,
                })
            ),
            InvalidVaccinationError
        );
    });

    test("Should register vaccination without notes", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                notes: undefined,
            })
        );

        expect(vaccination.notes).toBeUndefined();
    });

    test("Should register vaccination without batch", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                batch: undefined,
            })
        );

        expect(vaccination.batch).toBeUndefined();
    });

    test("Should register vaccination without next dose date", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                nextDoseDate: undefined,
            })
        );

        expect(vaccination.nextDoseDate).toBeUndefined();
    });

    test("Should register vaccination without dose", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                dose: undefined,
            })
        );

        expect(vaccination.dose).toBeUndefined();
    });
});
