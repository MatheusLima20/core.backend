import { ItemEntity } from "../entities/item.entity";

export type CreateItemDTO = Pick<
    ItemEntity,
    "name" | "description" | "orderUID" | "platformUID" | "value" | "amount" | "isForSale"
>;

export type ItemCreateResponseDTO = Pick<ItemEntity, "uid" | "name" | "description" | "orderUID" | "value" | "updatedAt">;