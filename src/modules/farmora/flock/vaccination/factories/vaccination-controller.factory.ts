import { InventoryItemEntity } from "@/modules/farmora/inventory/entities/inventory-item.entity";
import { TypeORMInventoryItemRepository } from "@/modules/farmora/inventory/repositories/implementations/typeorm-inventory-item.repository";
import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { FlockEntity } from "../../flock/entities/flock.entity";
import { TypeORMFlockRepository } from "../../flock/repositories/implementations/type-orm-flock.repository";
import { VaccinationController } from "../controllers/vaccination.controller";
import { VaccinationEntity } from "../entities/vaccination.entity";
import { TypeORMVaccinationRepository } from "../repositories/implementations/type-orm-vaccination.repository";
import { VaccinationUsecase } from "../usecases/vaccination.usecase";

export function makeVaccinationController(context: RequestContext) {
    const vaccinationRepository = new TypeORMVaccinationRepository(
        dataSource.getRepository(VaccinationEntity)
    );

    const flockRepository = new TypeORMFlockRepository(dataSource.getRepository(FlockEntity));

    const inventoryItemRepository = new TypeORMInventoryItemRepository(
        dataSource.getRepository(InventoryItemEntity)
    );

    const usecase = new VaccinationUsecase(
        context,
        vaccinationRepository,
        flockRepository,
        inventoryItemRepository
    );

    return new VaccinationController(usecase);
}
