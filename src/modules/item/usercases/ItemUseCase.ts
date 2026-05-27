import { randomUUID } from "crypto";
import { CreateItemDTO } from "../dtos/create-item.dto";
import { ItemEntity } from "../entities/ItemEntity";
import { IItemRepository } from "../repositories/interfaces/IItemRepository";
import { UpdateItemDTO } from "../dtos/update-item.dto";

export class ItemUseCase {
    constructor(private itemRepository: IItemRepository) {}

    async create(data: CreateItemDTO) {
        await this.validateItemAlreadyExists(data.name);

        const item = new ItemEntity({
            uid: randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
        });

        const resultItem = await this.itemRepository.register(item);

        if (!resultItem) {
            throw new Error("Item not register!");
        }

        return resultItem;
    }

    async findByUID(uid: string) {
        const item = await this.itemRepository.findByUID(uid);

        if (!item) {
            throw new Error("Item not found!");
        }

        return item;
    }

    async findByName(name: string) {
        const item = await this.itemRepository.findByName(name);

        if (!item) {
            throw new Error("Item not found!");
        }

        return item;
    }

    async findByOrderUID(uid: string) {
        const item = await this.itemRepository.findByOrderUID(uid);

        if (!item) {
            throw new Error("Items not found!");
        }

        return item;
    }

    async update(data: UpdateItemDTO) {
        await this.validateItemAlreadyExists(data.name, data.uid);

        const oldItem = await this.findByUID(data.uid);

        const mergedItem = new ItemEntity({
            ...oldItem,
            ...data,
            updatedAt: new Date(),
        });

        const item = await this.itemRepository.update(mergedItem);

        if (!item) {
            throw new Error("Item not updated!");
        }

        return item;
    }

    async delete(uid: string) {

        await this.findByUID(uid);

        const isDeleted = await this.itemRepository.delete(uid);

        if (!isDeleted) {
            throw new Error("Items not found!");
        }

        return isDeleted;
    }

    private async validateItemAlreadyExists(name: string, uid?: string) {
        const item = await this.itemRepository.findByName(name);

        if (item && item.uid !== uid) {
            throw new Error("Item already exists!");
        }
    }
}
