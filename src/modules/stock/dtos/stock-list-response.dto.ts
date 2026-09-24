import { StockResponseDTO } from "./stock-response.dto";

export interface StockListResponseDTO extends StockResponseDTO {
    product: {
        name: string;
        description: string | null;
        price: number;
        content: {
            url: string;
        } | null;
    };
}
