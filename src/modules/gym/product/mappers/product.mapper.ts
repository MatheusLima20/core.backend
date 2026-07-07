import { CreateProductResponseDTO } from "../dtos/create-product.dto";
import { ProductResponseDTO } from "../dtos/product-response.dto";
import { UpdateProductResponseDTO } from "../dtos/update-product.dto";
import { ProductProps } from "../entities/product.props";

export const ProductMapper = {
    toCreatedResponseDTO: (product: ProductProps): CreateProductResponseDTO => {
        return {
            uid: product.uid,
            name: product.name,
            description: product.description,
            isForSale: product.isForSale,
            isOnSale: product.isOnSale,
            currentPrice: product.currentPrice,
            amount: product.amount,
            platformUID: product.platformUID,
            createdBy: product.createdBy,
            createdAt: product.createdAt,
        };
    },

    toUpdatedResponseDTO: (product: ProductProps): UpdateProductResponseDTO => {
        return {
            uid: product.uid,
            name: product.name,
            description: product.description,
            isForSale: product.isForSale,
            isOnSale: product.isOnSale,
            currentPrice: product.currentPrice,
            amount: product.amount,
            updatedBy: product.updatedBy,
            updatedAt: product.updatedAt,
        };
    },

    toResponseDTO: (product: ProductProps): ProductResponseDTO => {
        return {
            uid: product.uid,
            name: product.name,
            description: product.description,
            isForSale: product.isForSale,
            isOnSale: product.isOnSale,
            platformUID: product.platformUID,
            currentPrice: product.currentPrice,
            amount: product.amount,
            createdBy: product.createdBy,
            updatedBy: product.updatedBy,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    },

    toResponseDTOList: (products: ProductProps[]): ProductResponseDTO[] => {
        return products.map(ProductMapper.toResponseDTO);
    },
};
