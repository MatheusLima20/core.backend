import { ProductResponseDTO } from "../dtos/product-response.dto";;
import { ProductProps } from "../entities/product.props";


export const ProductMapper = {
    toPlatformUIDResponse: (product: ProductProps): ProductResponseDTO => {
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

    toPlatformUIDResponseList: (
        products: ProductProps[],
    ): ProductResponseDTO[] => {
        return products.map(ProductMapper.toPlatformUIDResponse);
    },
};
