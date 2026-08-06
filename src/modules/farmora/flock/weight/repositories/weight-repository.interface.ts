import { Result } from "@/shared/result";

import { FindWeightsDTO } from "../dtos/find-weights.dto";
import { WeightProps } from "../entities/weight.props";

export interface IWeightRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<WeightProps | null>>;

    find(platformUID: string, filters?: FindWeightsDTO): Promise<Result<WeightProps[]>>;

    exists(
        platformUID: string,
        data: {
            flockUID: string;
            weighingDate: Date;
            ignoreUID?: string;
        }
    ): Promise<Result<boolean>>;

    register(weight: WeightProps): Promise<Result<WeightProps>>;

    update(weight: WeightProps): Promise<Result<WeightProps>>;

    delete(uid: string): Promise<Result<void>>;
}
