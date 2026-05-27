import { ItemResponseDTO } from "../../dtos/create-item.dto";
import { ItemEntity } from "../../entities/ItemEntity";
import { IItemRepository } from "../interfaces/IItemRepository";


export class InMemoryItemRepository implements IItemRepository {
    items: ItemEntity[] = [];

    async getByUID(uid: string): Promise<ItemEntity | null> {
        return this.items.find((item) => item.uid === uid) || null;
    }

    async getByName(name: string): Promise<ItemEntity | null> {
        return this.items.find((item) => item.name === name) || null;
    }

    async register(item: ItemEntity): Promise<ItemResponseDTO | null> {
        try {
            this.items.push(item);

            return item;
        } catch (error) {
            return null;
        }
    }

    async update(item: ItemEntity): Promise<ItemEntity | null> {
        throw new Error("Method not implemented.");
    }

    delete(item: ItemEntity): Promise<boolean | null> {
        throw new Error("Method not implemented.");
    }
}
