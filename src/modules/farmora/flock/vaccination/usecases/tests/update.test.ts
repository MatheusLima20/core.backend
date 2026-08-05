import { InventoryItemNotFoundError } from "@/modules/farmora/inventory/errors/inventory-item-not-found.error";
import { InventoryItemUsecase } from "@/modules/farmora/inventory/usecases/inventory-item.usecase";
import { inventoryItem1 } from "@/modules/farmora/inventory/usecases/tests/factories/inventory-item.factory";
import { setupInventoryItem } from "@/modules/farmora/inventory/usecases/tests/setup/inventory-item.setup";
import { AuthUser } from "@/shared/context/auth.user";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { FlockUsecase } from "../../../flock/usecases/flock.usecase";
import { activeFlock } from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { UpdateVaccinationDTO } from "../../dtos/update-vaccination.dto";
import { VaccinationNotFoundError } from "../../errors/vaccination.not-found.error";
import { VaccinationUsecase } from "../vaccination.usecase";
import { makeVaccination } from "./factory/vaccination.factory";
import { scenario } from "./setup/test-vaccination.builder";
import { setupVaccination } from "./setup/vaccination.setup";

describe("VaccinationUsecase - update", () => {
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

    test("Should update a vaccination", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
            })
        );

        const data: UpdateVaccinationDTO = {
            uid: vaccination.uid,

            applicationDate: new Date("2026-08-01"),

            dose: "2 doses",

            batch: "BATCH-002",

            notes: "Updated vaccination",
        };

        const updated = expectSuccess(await usecaseUser1.update(data));

        expect(updated).toMatchObject({
            uid: vaccination.uid,

            applicationDate: data.applicationDate,

            dose: data.dose,

            batch: data.batch,

            notes: data.notes,

            updatedBy: user1.uid,
        });

        const found = expectSuccess(await usecaseUser1.findByUID(vaccination.uid));

        expect(found).toMatchObject(updated);

        expect(found?.updatedBy).not.toBe(user2.uid);
    });

    test("Should update only dose", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: vaccination.uid,

                dose: "2ml",
            })
        );

        expect(updated.dose).toBe("2ml");
    });

    test("Should update only batch", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: vaccination.uid,

                batch: "NEW-BATCH",
            })
        );

        expect(updated.batch).toBe("NEW-BATCH");
    });

    test("Should update only notes", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: vaccination.uid,

                notes: "New notes",
            })
        );

        expect(updated.notes).toBe("New notes");
    });

    test("Should remove notes", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,

                notes: "Old notes",
            })
        );

        const updated = expectSuccess(
            await usecaseUser1.update({
                uid: vaccination.uid,

                notes: undefined,
            })
        );

        expect(updated.notes).toBeUndefined();
    });

    test("Should not update vaccination with invalid item", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
            })
        );

        expectFailure(
            await usecaseUser1.update({
                uid: vaccination.uid,

                itemUID: "invalid-item",
            }),
            InventoryItemNotFoundError
        );
    });

    test("Should not update an inexistent vaccination", async () => {
        expectFailure(
            await usecaseUser1.update({
                uid: "invalid-vaccination",

                notes: "Updated",
            }),
            VaccinationNotFoundError
        );
    });

    test("Should not update vaccination from another platform", async () => {
        const vaccination = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
            })
        );

        expectFailure(
            await usecaseUser2.update({
                uid: vaccination.uid,

                notes: "Changed",
            }),
            VaccinationNotFoundError
        );
    });
});
