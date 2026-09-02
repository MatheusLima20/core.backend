import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindVaccinationsDTO } from "../dtos/find-vaccination.dto";
import { VaccinationEntity } from "../entities/vaccination.entity";

export interface IVaccinationRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<VaccinationEntity | null>>;

    find(
        platformUID: string,
        filters?: FindVaccinationsDTO
    ): Promise<Result<PaginationResult<VaccinationEntity>>>;

    exists(
        platformUID: string,
        data: {
            flockUID: string;
            itemUID: string;
            applicationDate: Date;
            ignoreUID?: string;
        }
    ): Promise<Result<boolean>>;

    register(vaccination: VaccinationEntity): Promise<Result<VaccinationEntity>>;

    update(vaccination: VaccinationEntity): Promise<Result<VaccinationEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
