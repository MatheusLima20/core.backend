import { getPublicUrl } from "@/shared/helpers/get-public-url";

import { CreateProductResponseDTO } from "../dtos/create-product.dto";
import { ProductListResponseDTO } from "../dtos/product-list-response.dto";
import { ProductResponseDTO } from "../dtos/product-response.dto";
import { UpdateProductResponseDTO } from "../dtos/update-product.dto";
import { ProductEntity } from "../entities/product.entity";
import { ProductWithContent } from "../types/product-with.content";

export const ProductMapper = {
    toResponseDTO: (product: ProductEntity): ProductResponseDTO => {
        return {
            uid: product.uid,
            platformUID: product.platformUID,
            contentUID: product.contentUID,
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

    toListResponseDTO(product: ProductWithContent): ProductListResponseDTO {
        return {
            uid: product.product.uid,
            platformUID: product.product.platformUID,
            categoryUID: product.product.categoryUID,
            contentUID: product.product.contentUID,
            name: product.product.name,
            description: product.product.description,
            price: product.product.price,
            barcode: product.product.barcode,
            sku: product.product.sku,
            active: product.product.active,
            contentURL: product.content?.url ? getPublicUrl(product.content?.url) : null,
            createdBy: product.product.createdBy,
            updatedBy: product.product.updatedBy,
            createdAt: product.product.createdAt,
            updatedAt: product.product.updatedAt,
        };
    },

    toCreatedResponseDTO: (product: ProductEntity): CreateProductResponseDTO => {
        return {
            uid: product.uid,
            categoryUID: product.categoryUID,
            contentUID: product.contentUID,
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
