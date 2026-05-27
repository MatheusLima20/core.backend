import { ItemResponseDTO } from "../../dtos/create-item.dto";
import { FindItemByNameDTO } from "../../dtos/item-by-name.dto";
import { FindItemByUidDTO } from "../../dtos/item-by-uid.dto";
import { ItemEntity } from "../../entities/ItemEntity";

export interface IItemRepository {
    getByUID(id: string): Promise<FindItemByUidDTO | null>;
    getByName(name: string): Promise<FindItemByNameDTO | null>;
    register(item: ItemEntity): Promise<ItemResponseDTO | null>;
    update(item: ItemEntity): Promise<ItemEntity | null>;
    delete(item: ItemEntity): Promise<boolean | null>;
}
