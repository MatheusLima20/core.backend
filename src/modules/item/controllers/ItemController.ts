import { IItem } from "../entities/interfaces/IItem";
import { ItemEntity } from "../entities/ItemEntity";
import { IItemRepository } from "../repositories/interfaces/IItemRepository";


export class ItemController implements IItemRepository {
    
    async register(order: IItem): Promise<boolean> {
        return true;
    }
    async getByUID(id: string): Promise<ItemEntity | null> {
        throw new Error("Method not implemented.");
    }
    
    update(order: IItem): Promise<IItem | null> {
        throw new Error("Method not implemented.");
    }
    delete(order: IItem): Promise<boolean | null> {
        throw new Error("Method not implemented.");
    }

}
