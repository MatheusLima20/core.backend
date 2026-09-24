import { ProductResponseDTO } from "./product-response.dto";

export interface ProductListResponseDTO extends ProductResponseDTO {
    contentURL: string | null;
}
