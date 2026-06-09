import { ItemEntity } from "../entities/item.entity";

export type ItemResponseDTO = Pick<
    ItemEntity,
    "uid" | "name" | "description" | "platformUID" | "orderUID" | "value" | "createdAt" | "updatedAt"
>;
