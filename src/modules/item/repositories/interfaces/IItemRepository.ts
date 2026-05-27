
import { ItemCreateResponseDTO } from "../../dtos/create-item.dto";
import { ItemResponseDTO } from "../../dtos/item-response.dto";
import { UpdateItemResponseDTO } from "../../dtos/update-item.dto";
import { ItemEntity } from "../../entities/ItemEntity";

export interface IItemRepository {
    findByOrderUID(orderID: string): Promise<ItemResponseDTO[]>;
    findByUID(uid: string): Promise<ItemResponseDTO | null>;
    findByName(name: string): Promise<ItemResponseDTO | null>;
    register(item: ItemEntity): Promise<ItemCreateResponseDTO | null>;
    update(item: ItemEntity): Promise<UpdateItemResponseDTO | null>;
    delete(uid: string): Promise<boolean | null>;
}
