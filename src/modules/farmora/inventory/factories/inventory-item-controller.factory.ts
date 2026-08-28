import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { InventoryItemController } from "../controller/inventory-item.controller";
import { InventoryItemEntity } from "../entities/inventory-item.entity";
import { TypeORMInventoryItemRepository } from "../repositories/implementations/typeorm-inventory-item.repository";
import { InventoryItemUsecase } from "../usecases/inventory-item.usecase";
export function makeInventoryItemController(context: RequestContext) {
    const inventoryItemRepository = new TypeORMInventoryItemRepository(
        dataSource.getRepository(InventoryItemEntity)
    );

    const usecase = new InventoryItemUsecase(context, inventoryItemRepository);

    return new InventoryItemController(usecase);
}
