import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { DateUtil } from "@/shared/utils/date/date.util";
import { PaginationUtil } from "@/shared/utils/pagination/pagination.util";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindVaccinationsDTO } from "../../dtos/find-vaccination.dto";
import { VaccinationProps } from "../../entities/vaccination.props";
import { IVaccinationRepository } from "../vaccination-repository.interface";

export class InMemoryVaccinationRepository implements IVaccinationRepository {
    private vaccinations: VaccinationProps[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<VaccinationProps | null>> {
        const vaccination =
            this.vaccinations.find(
                (vaccination) =>
                    StringUtil.equals(vaccination.platformUID!, platformUID) &&
                    StringUtil.equals(vaccination.uid, uid)
            ) ?? null;

        return ResultFactory.success(vaccination);
    }

    async find(
        platformUID: string,
        filters?: FindVaccinationsDTO
    ): Promise<Result<VaccinationProps[]>> {
        let vaccinations = this.vaccinations.filter((vaccination) =>
            StringUtil.equals(vaccination.platformUID!, platformUID)
        );

        if (filters?.flockUID) {
            vaccinations = vaccinations.filter((vaccination) =>
                StringUtil.equals(vaccination.flockUID, filters.flockUID!)
            );
        }

        if (filters?.vaccineName) {
            vaccinations = vaccinations.filter((vaccination) =>
                StringUtil.equals(vaccination.vaccineName, filters.vaccineName!)
            );
        }

        if (filters?.applicationDate) {
            vaccinations = vaccinations.filter((vaccination) =>
                DateUtil.isSameDay(vaccination.applicationDate, filters.applicationDate!)
            );
        }

        if (filters?.startDate) {
            vaccinations = vaccinations.filter(
                (vaccination) => vaccination.applicationDate >= filters.startDate!
            );
        }

        if (filters?.endDate) {
            vaccinations = vaccinations.filter(
                (vaccination) => vaccination.applicationDate <= filters.endDate!
            );
        }

        if (filters?.nextDoseDate) {
            vaccinations = vaccinations.filter((vaccination) =>
                DateUtil.isSameDay(vaccination.nextDoseDate!, filters.nextDoseDate!)
            );
        }

        if (filters?.manufacturer) {
            vaccinations = vaccinations.filter((vaccination) =>
                StringUtil.equals(vaccination.manufacturer!, filters.manufacturer!)
            );
        }

        if (filters?.batch) {
            vaccinations = vaccinations.filter((vaccination) =>
                StringUtil.equals(vaccination.batch!, filters.batch!)
            );
        }

        if (filters?.orderBy) {
            vaccinations = SortUtil.sort({
                items: vaccinations,
                orderBy: filters.orderBy,
                order: filters.order,
            });
        }

        if (filters?.page && filters?.limit) {
            vaccinations = PaginationUtil.paginate(vaccinations, filters.page, filters.limit);
        }

        return ResultFactory.success(vaccinations);
    }

    async exists(
        platformUID: string,
        data: {
            flockUID: string;
            vaccineName: string;
            applicationDate: Date;
        }
    ): Promise<Result<boolean>> {
        const exists = this.vaccinations.some(
            (vaccination) =>
                StringUtil.equals(vaccination.platformUID!, platformUID) &&
                StringUtil.equals(vaccination.flockUID, data.flockUID) &&
                StringUtil.equals(vaccination.vaccineName, data.vaccineName) &&
                DateUtil.isSameDay(vaccination.applicationDate, data.applicationDate)
        );

        return ResultFactory.success(exists);
    }

    async register(vaccination: VaccinationProps): Promise<Result<VaccinationProps>> {
        this.vaccinations.push(vaccination);

        return ResultFactory.success(vaccination);
    }

    async update(vaccination: VaccinationProps): Promise<Result<VaccinationProps>> {
        const index = this.vaccinations.findIndex((item) =>
            StringUtil.equals(item.uid, vaccination.uid)
        );

        this.vaccinations[index] = vaccination;

        return ResultFactory.success(vaccination);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.vaccinations.findIndex((item) => StringUtil.equals(item.uid, uid));

        if (index !== -1) {
            this.vaccinations.splice(index, 1);
        }

        return ResultFactory.success(undefined);
    }
}
