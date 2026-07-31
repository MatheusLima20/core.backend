import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { CreateInventoryItemDTO } from "../../../dtos/create-inventory-item.dto";
import { InventoryItemUsecase } from "../../inventory-item.usecase";

export async function setupInventoryItems(
    usecase: InventoryItemUsecase,
    ...inventoryItems: CreateInventoryItemDTO[]
) {
    return Promise.all(
        inventoryItems.map((inventoryItem) => createInventoryItemOrFail(usecase, inventoryItem))
    );
}

export async function setupInventoryItem(
    usecase: InventoryItemUsecase,
    inventoryItem: CreateInventoryItemDTO
) {
    return createInventoryItemOrFail(usecase, inventoryItem);
}

async function createInventoryItemOrFail(
    usecase: InventoryItemUsecase,
    dto: CreateInventoryItemDTO
) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateInventoryItemFailure<E extends AppError>(
    usecase: InventoryItemUsecase,
    dto: CreateInventoryItemDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
