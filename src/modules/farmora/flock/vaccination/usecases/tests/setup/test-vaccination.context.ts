import { InMemoryFlockRepository } from "@/modules/farmora/flock/flock/repositories/implementations/in-memory-flock.repository";
import { FlockUsecase } from "@/modules/farmora/flock/flock/usecases/flock.usecase";
import { InMemoryInventoryItemRepository } from "@/modules/farmora/inventory/repositories/implementations/in-memory-inventory-item.repository";
import { InventoryItemUsecase } from "@/modules/farmora/inventory/usecases/inventory-item.usecase";
import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryVaccinationRepository } from "../../../repositories/implementations/in-memory-vaccination.repository";
import { VaccinationUsecase } from "../../vaccination.usecase";

export class TestVaccinationContext {
    userRepository = new InMemoryUserRepository();

    flockRepository = new InMemoryFlockRepository();

    vaccinationRepository = new InMemoryVaccinationRepository();

    inventoryItemRepository = new InMemoryInventoryItemRepository();

    membershipRepository = new InMemoryMembershipRepository();

    users: AuthUser[] = [];

    flockUsecases: FlockUsecase[] = [];

    vaccinationUsecases: VaccinationUsecase[] = [];

    inventoryItemUsecases: InventoryItemUsecase[] = [];
}
