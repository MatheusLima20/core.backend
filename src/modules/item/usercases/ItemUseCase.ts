import { randomUUID } from "crypto";
import { CreateItemDTO } from "../dtos/create-item.dto";
import { ItemEntity } from "../entities/ItemEntity";
import { IItemRepository } from "../repositories/interfaces/IItemRepository";

export class ItemUseCase {
    constructor(private itemRepository: IItemRepository) {}

    async execute(data: CreateItemDTO) {
        const itemAlreadyExists = await this.itemRepository.getByName(
            data.name,
        );

        if (itemAlreadyExists) {
            throw new Error("Item already exists!");
        }

        const item = new ItemEntity({
            uid: randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
        });

        const resultItem = await this.itemRepository.register(item);

        if (!resultItem) {
            throw new Error("Item not found!");
        }

        return resultItem;
    }

    async findByUId(uid: string) {

        const item = await this.itemRepository.getByUID(uid);

        if (!item) {
            throw new Error("Item not found!");
        }

        return item;
    }

    async findByName(name: string) {
        const item = await this.itemRepository.getByName(name);

        if (!item) {
            throw new Error("Item not found!");
        }

        return item;
    }

    async change(data: ItemEntity) {}
}
