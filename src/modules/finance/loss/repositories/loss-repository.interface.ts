import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindLossesDTO } from "../dtos/find-losses.dto";
import { LossEntity } from "../entities/loss.entity";

export interface ILossRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<LossEntity | null>>;

    find(
        platformUID: string,
        filters?: FindLossesDTO
    ): Promise<Result<PaginationResult<LossEntity>>>;

    register(loss: LossEntity): Promise<Result<LossEntity>>;

    update(loss: LossEntity): Promise<Result<LossEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
