import { CreateProductResponseDTO } from "../dtos/create-product.dto";
import { ProductResponseDTO } from "../dtos/product-response.dto";
import { UpdateProductResponseDTO } from "../dtos/update-product.dto";
import { ProductEntity } from "../entities/product.entity";

export const ProductMapper = {
    toResponseDTO: (product: ProductEntity): ProductResponseDTO => {
        return {
            uid: product.uid,
            platformUID: product.platformUID,
            categoryUID: product.categoryUID,
            name: product.name,
            description: product.description,
            price: product.price,
            active: product.active,
            barcode: product.barcode,
            sku: product.sku,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            createdBy: product.createdBy,
            updatedBy: product.updatedBy,
        };
    },

    toResponseDTOList: (products: ProductEntity[]): ProductResponseDTO[] => {
        return products.map(ProductMapper.toResponseDTO);
    },

    toCreatedResponseDTO: (product: ProductEntity): CreateProductResponseDTO => {
        return {
            uid: product.uid,
            categoryUID: product.categoryUID,
            name: product.name,
            description: product.description,
            price: product.price,
            active: product.active,
            barcode: product.barcode,
            sku: product.sku,
            createdAt: product.createdAt,
            createdBy: product.createdBy,
        };
    },

    toUpdatedResponseDTO: (product: ProductEntity): UpdateProductResponseDTO => {
        return {
            uid: product.uid,
            categoryUID: product.categoryUID,
            name: product.name,
            description: product.description,
            price: product.price,
            active: product.active,
            barcode: product.barcode,
            sku: product.sku,
            updatedAt: product.updatedAt,
            updatedBy: product.updatedBy,
        };
    },
};
