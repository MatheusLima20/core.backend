import { CreateStockResponseDTO } from "../dtos/create-stock.dto";
import { StockResponseDTO } from "../dtos/stock-response.dto";
import { UpdateStockResponseDTO } from "../dtos/update-stock.dto";
import { StockEntity } from "../entities/stock.entity";

export const StockMapper = {
    toResponseDTO: (stock: StockEntity): StockResponseDTO => {
        return {
            uid: stock.uid,
            platformUID: stock.platformUID,
            productUID: stock.productUID,
            quantity: stock.quantity,
            minimumStock: stock.minimumStock,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
            createdBy: stock.createdBy,
            updatedBy: stock.updatedBy,
        };
    },

    toResponseDTOList: (stocks: StockEntity[]): StockResponseDTO[] => {
        return stocks.map(StockMapper.toResponseDTO);
    },

    toCreatedResponseDTO: (stock: StockEntity): CreateStockResponseDTO => {
        return {
            uid: stock.uid,
            productUID: stock.productUID,
            quantity: stock.quantity,
            minimumStock: stock.minimumStock,
            createdAt: stock.createdAt,
            createdBy: stock.createdBy,
        };
    },

    toUpdatedResponseDTO: (stock: StockEntity): UpdateStockResponseDTO => {
        return {
            uid: stock.uid,
            productUID: stock.productUID,
            quantity: stock.quantity,
            minimumStock: stock.minimumStock,
            updatedAt: stock.updatedAt,
            updatedBy: stock.updatedBy,
        };
    },
};
