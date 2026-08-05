import { InMemoryInventoryItemRepository } from "@/modules/farmora/inventory/repositories/implementations/in-memory-inventory-item.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryFlockRepository } from "../../../../flock/repositories/implementations/in-memory-flock.repository";
import { InMemoryVaccinationRepository } from "../../../repositories/implementations/in-memory-vaccination.repository";
import { VaccinationUsecase } from "../../vaccination.usecase";

export function makeVaccinationUsecase(
    user: AuthUser,
    vaccinationRepository: InMemoryVaccinationRepository,
    flockRepository: InMemoryFlockRepository,
    inventoryRepository: InMemoryInventoryItemRepository
) {
    const context = { user };

    return {
        usecase: new VaccinationUsecase(
            context,
            vaccinationRepository,
            flockRepository,
            inventoryRepository
        ),
    };
}
