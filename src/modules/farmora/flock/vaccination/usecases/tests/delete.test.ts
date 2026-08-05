import { inventoryItem1 } from "@/modules/farmora/inventory/usecases/tests/factories/inventory-item.factory";
import { setupInventoryItem } from "@/modules/farmora/inventory/usecases/tests/setup/inventory-item.setup";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { activeFlock } from "../../../flock/usecases/tests/factories/flock-data.factory";
import { setupFlock } from "../../../flock/usecases/tests/setup/flock-tests.setup";
import { VaccinationNotFoundError } from "../../errors/vaccination.not-found.error";
import { VaccinationUsecase } from "../vaccination.usecase";
import { makeVaccination } from "./factory/vaccination.factory";
import { scenario } from "./setup/test-vaccination.builder";
import { setupVaccination } from "./setup/vaccination.setup";

describe("VaccinationUsecase - delete", () => {
    let usecaseUser1!: VaccinationUsecase;
    let usecaseUser2!: VaccinationUsecase;

    let flockUsecaseUser1!: any;

    let inventoryItemUsecaseUser1!: any;

    let flock1!: Awaited<ReturnType<typeof setupFlock>>;

    let item1!: Awaited<ReturnType<typeof setupInventoryItem>>;

    beforeEach(async () => {
        ({
            vaccinationUsecases: [usecaseUser1, usecaseUser2],

            flockUsecases: [flockUsecaseUser1],

            inventoryItemUsecases: [inventoryItemUsecaseUser1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        flock1 = await setupFlock(flockUsecaseUser1, activeFlock);

        item1 = await setupInventoryItem(inventoryItemUsecaseUser1, inventoryItem1);
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

    test("Should delete a vaccination", async () => {
        const vaccination = await createVaccination(usecaseUser1, flock1.uid, item1.uid);

        const before = expectSuccess(await usecaseUser1.find());

        expectSuccess(await usecaseUser1.delete(vaccination.uid));

        const after = expectSuccess(await usecaseUser1.find());

        expect(before).toHaveLength(1);

        expect(after).toHaveLength(0);

        const found = expectSuccess(await usecaseUser1.findByUID(vaccination.uid));

        expect(found).toBe(null);
    });

    test("Should delete only selected vaccination", async () => {
        const vaccinationA = await createVaccination(usecaseUser1, flock1.uid, item1.uid);

        const vaccinationB = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                applicationDate: new Date("2026-01-02"),
            })
        );

        expectSuccess(await usecaseUser1.delete(vaccinationA.uid));

        const deleted = expectSuccess(await usecaseUser1.findByUID(vaccinationA.uid));

        expect(deleted).toBe(null);

        const remaining = expectSuccess(await usecaseUser1.findByUID(vaccinationB.uid));

        expect(remaining?.uid).toBe(vaccinationB.uid);
    });

    test("Should not delete an inexistent vaccination", async () => {
        expectFailure(await usecaseUser1.delete("invalid-vaccination"), VaccinationNotFoundError);
    });

    test("Should not delete vaccination from another platform", async () => {
        const vaccination = await createVaccination(usecaseUser1, flock1.uid, item1.uid);

        expectFailure(await usecaseUser2.delete(vaccination.uid), VaccinationNotFoundError);

        expectSuccess(await usecaseUser1.findByUID(vaccination.uid));
    });

    test("Should not delete vaccination from another platform without affecting data", async () => {
        const vaccination = await createVaccination(usecaseUser1, flock1.uid, item1.uid);

        const user2Vaccinations = expectSuccess(await usecaseUser2.find());

        expect(user2Vaccinations).toHaveLength(0);

        expectFailure(await usecaseUser2.delete(vaccination.uid), VaccinationNotFoundError);

        const user1Vaccinations = expectSuccess(await usecaseUser1.find());

        expect(user1Vaccinations).toHaveLength(1);

        expect(user1Vaccinations[0].uid).toBe(vaccination.uid);
    });

    test("Should delete one vaccination keeping remaining vaccinations", async () => {
        const vaccinationA = await createVaccination(usecaseUser1, flock1.uid, item1.uid);

        const vaccinationB = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                applicationDate: new Date("2026-01-02"),
            })
        );

        const vaccinationC = await setupVaccination(
            usecaseUser1,
            makeVaccination({
                flockUID: flock1.uid,
                itemUID: item1.uid,
                applicationDate: new Date("2026-01-03"),
            })
        );

        expectSuccess(await usecaseUser1.delete(vaccinationB.uid));

        const vaccinations = expectSuccess(await usecaseUser1.find());

        expect(vaccinations).toHaveLength(2);

        expect(vaccinations.map((vaccination) => vaccination.uid)).toEqual(
            expect.arrayContaining([vaccinationA.uid, vaccinationC.uid])
        );

        const deleted = expectSuccess(await usecaseUser1.findByUID(vaccinationB.uid));

        expect(deleted).toBe(null);
    });
});
