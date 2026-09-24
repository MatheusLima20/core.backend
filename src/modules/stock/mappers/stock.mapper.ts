import { CreateStockResponseDTO } from "../dtos/create-stock.dto";
import { StockListResponseDTO } from "../dtos/stock-list-response.dto";
import { StockResponseDTO } from "../dtos/stock-response.dto";
import { UpdateStockResponseDTO } from "../dtos/update-stock.dto";
import { StockEntity } from "../entities/stock.entity";
import { StockWithProduct } from "../types/stock-with-product";

export const StockMapper = {
    toResponseDTO: (stock: StockEntity): StockResponseDTO => ({
        uid: stock.uid,
        platformUID: stock.platformUID,
        productUID: stock.productUID,
        quantity: stock.quantity,
        minimumStock: stock.minimumStock,
        createdAt: stock.createdAt,
        updatedAt: stock.updatedAt,
        createdBy: stock.createdBy,
        updatedBy: stock.updatedBy,
    }),

    toResponseDTOList: (stocks: StockEntity[]): StockResponseDTO[] =>
        stocks.map(StockMapper.toResponseDTO),

    toListResponseDTO: ({ stock, product }: StockWithProduct): StockListResponseDTO => ({
        uid: stock.uid,
        platformUID: stock.platformUID,
        productUID: stock.productUID,
        quantity: stock.quantity,
        minimumStock: stock.minimumStock,
        createdAt: stock.createdAt,
        updatedAt: stock.updatedAt,
        createdBy: stock.createdBy,
        updatedBy: stock.updatedBy,

        product: {
            name: product.name,
            description: product.description,
            price: product.price,
            content: product.content,
        },
    }),

    toCreatedResponseDTO: (stock: StockEntity): CreateStockResponseDTO => ({
        uid: stock.uid,
        productUID: stock.productUID,
        quantity: stock.quantity,
        minimumStock: stock.minimumStock,
        createdAt: stock.createdAt,
        createdBy: stock.createdBy,
    }),

    toUpdatedResponseDTO: (stock: StockEntity): UpdateStockResponseDTO => ({
        uid: stock.uid,
        productUID: stock.productUID,
        quantity: stock.quantity,
        minimumStock: stock.minimumStock,
        updatedAt: stock.updatedAt,
        updatedBy: stock.updatedBy,
    }),
};
