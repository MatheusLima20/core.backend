import { Result } from "@/shared/result";

import { FindLossesDTO } from "../dtos/find-losses.dto";
import { LossProps } from "../entities/loss.props";

export interface ILossRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<LossProps | null>>;

    find(platformUID: string, filters?: FindLossesDTO): Promise<Result<LossProps[]>>;

    register(loss: LossProps): Promise<Result<LossProps>>;

    update(loss: LossProps): Promise<Result<LossProps>>;

    delete(uid: string): Promise<Result<void>>;
}
