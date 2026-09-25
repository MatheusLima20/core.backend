import { ResponseEggProductionDTO } from "./egg-production-response.dto";

export interface EggProductionListResponseDTO extends ResponseEggProductionDTO {
    flockName: string | null;
}
