import { ProductResponseDTO } from "../dtos/product-response.dto";
import { ProductEntity } from "../entities/product.entity";


export const ProductMapper = {
    toPlatformUIDResponse: (product: ProductEntity): ProductResponseDTO => {
        return {
            uid: product.uid,
            name: product.name,
            description: product.description,
            isForSale: product.isForSale,
            isOnSale: product.isOnSale,
            platformUID: product.platformUID,
            price: product.price,
            amount: product.amount,
            createdBy: product.createdBy,
            updatedBy: product.updatedBy,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    },

    toPlatformUIDResponseList: (
        products: ProductEntity[],
    ): ProductResponseDTO[] => {
        return products.map(ProductMapper.toPlatformUIDResponse);
    },
};
