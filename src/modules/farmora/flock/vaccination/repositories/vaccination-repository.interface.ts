import { Result } from "@/shared/result";

import { FindVaccinationsDTO } from "../dtos/find-vaccination.dto";
import { VaccinationProps } from "../entities/vaccination.props";

export interface IVaccinationRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<VaccinationProps | null>>;

    find(platformUID: string, filters?: FindVaccinationsDTO): Promise<Result<VaccinationProps[]>>;

    exists(
        platformUID: string,
        data: {
            flockUID: string;
            vaccineName: string;
            applicationDate: Date;
        }
    ): Promise<Result<boolean>>;

    register(vaccination: VaccinationProps): Promise<Result<VaccinationProps>>;

    update(vaccination: VaccinationProps): Promise<Result<VaccinationProps>>;

    delete(uid: string): Promise<Result<void>>;
}
