import { Result } from "@/shared/result";

import { FindMortalitiesDTO } from "../dtos/find-mortality.dto";
import { MortalityProps } from "../entities/mortality.props";

export interface IMortalityRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<MortalityProps | null>>;

    find(platformUID: string, filters?: FindMortalitiesDTO): Promise<Result<MortalityProps[]>>;

    register(mortality: MortalityProps): Promise<Result<MortalityProps>>;

    update(mortality: MortalityProps): Promise<Result<MortalityProps>>;

    delete(uid: string): Promise<Result<void>>;
}
