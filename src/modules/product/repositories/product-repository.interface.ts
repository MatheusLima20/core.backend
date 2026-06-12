import {
    CreateProductDTO,
    CreateProductResponseDTO,
} from "../dtos/create-product.dto";
import { ProductResponseDTO } from "../dtos/product-response.dto";
import { UpdateProductResponseDTO } from "../dtos/update-product.dto";
import { ProductProps } from "../entities/product.props";

export interface IProductRepository {
    search(filters: {
        name?: string;
        description?: string;
        platformUID: string;
    }): Promise<ProductResponseDTO[]>;
    findByUID(uid: string, platformUID: string): Promise<ProductResponseDTO | null>;
    findByName(
        name: string,
        platformUID: string,
    ): Promise<ProductResponseDTO | null>;
    find(platformUID: string): Promise<ProductResponseDTO[]>;
    register(user: ProductProps): Promise<CreateProductResponseDTO | null>;
    update(user: ProductProps): Promise<UpdateProductResponseDTO | null>;
    delete(uid: string): Promise<boolean>;
}
