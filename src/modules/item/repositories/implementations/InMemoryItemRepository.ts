import { ItemCreateResponseDTO } from "../../dtos/create-item.dto";
import { ItemResponseDTO } from "../../dtos/item-response.dto";
import { UpdateItemResponseDTO } from "../../dtos/update-item.dto";
import { ItemEntity } from "../../entities/ItemEntity";
import { ItemMapper } from "../../mappers/item.mapper";
import { IItemRepository } from "../interfaces/IItemRepository";

export class InMemoryItemRepository implements IItemRepository {
    items: ItemEntity[] = [];

    async findByOrderUID(idOrder: string): Promise<ItemResponseDTO[]> {
        const item = this.items.filter((item) => item.orderId === idOrder);

        return ItemMapper.toOrderUIDResponseList(item);
    }

    async findByUID(uid: string): Promise<ItemResponseDTO | null> {
        return this.items.find((item) => item.uid === uid) || null;
    }

    async findByName(name: string): Promise<ItemResponseDTO | null> {
        return this.items.find((item) => item.name === name) || null;
    }

    async register(item: ItemEntity): Promise<ItemCreateResponseDTO | null> {
        this.items.push(item);

        return item;
    }

    async update(item: ItemEntity): Promise<UpdateItemResponseDTO | null> {
        const index = this.items.findIndex(
            (oldItem) => oldItem.uid === item.uid,
        );

        const newItem = (this.items[index] = item);

        return newItem;
    }

    async delete(uid: string): Promise<boolean | null> {
        const index = this.items.findIndex((oldItem) => oldItem.uid === uid);

        const removedItem = this.items.splice(index, 1);

        return !!removedItem;
    }
}
