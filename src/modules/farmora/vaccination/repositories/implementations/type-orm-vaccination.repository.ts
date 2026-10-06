import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindVaccinationsDTO } from "../../dtos/find-vaccination.dto";
import { VaccinationEntity } from "../../entities/vaccination.entity";
import { IVaccinationRepository } from "../vaccination-repository.interface";

export class TypeORMVaccinationRepository implements IVaccinationRepository {
    constructor(private readonly vaccinationRepository: Repository<VaccinationEntity>) {}

    async findByUID(platformUID: string, uid: string): Promise<Result<VaccinationEntity | null>> {
        const vaccination = await this.vaccinationRepository.findOne({
            where: {
                uid,
                platformUID,
            },
        });

        return ResultFactory.success(vaccination);
    }

    async find(
        platformUID: string,
        filters?: FindVaccinationsDTO
    ): Promise<Result<PaginationResult<VaccinationEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.vaccinationRepository
            .createQueryBuilder("vaccination")
            .where("vaccination.platformUID = :platformUID", {
                platformUID,
            });

        if (filters?.flockUID) {
            query.andWhere("vaccination.flockUID = :flockUID", {
                flockUID: filters.flockUID,
            });
        }

        if (filters?.itemUID) {
            query.andWhere("vaccination.itemUID = :itemUID", {
                itemUID: filters.itemUID,
            });
        }

        if (filters?.applicationDate) {
            query.andWhere("DATE(vaccination.applicationDate) = DATE(:applicationDate)", {
                applicationDate: filters.applicationDate,
            });
        }

        if (filters?.startDate) {
            query.andWhere("vaccination.applicationDate >= :startDate", {
                startDate: filters.startDate,
            });
        }

        if (filters?.endDate) {
            query.andWhere("vaccination.applicationDate <= :endDate", {
                endDate: filters.endDate,
            });
        }

        if (filters?.nextDoseDate) {
            query.andWhere("DATE(vaccination.nextDoseDate) = DATE(:nextDoseDate)", {
                nextDoseDate: filters.nextDoseDate,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `vaccination.${filters.orderBy}`,
                filters.order?.toUpperCase() === "DESC" ? "DESC" : "ASC"
            );
        }

        const total = await query.getCount();

        query.skip((page - 1) * limit).take(limit);

        const data = await query.getMany();

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    }

    async exists(
        platformUID: string,
        data: {
            flockUID: string;
            itemUID: string;
            applicationDate: Date;
            ignoreUID?: string;
        }
    ): Promise<Result<boolean>> {
        const query = this.vaccinationRepository
            .createQueryBuilder("vaccination")
            .where("vaccination.platformUID = :platformUID", {
                platformUID,
            })
            .andWhere("vaccination.flockUID = :flockUID", {
                flockUID: data.flockUID,
            })
            .andWhere("vaccination.itemUID = :itemUID", {
                itemUID: data.itemUID,
            })
            .andWhere("DATE(vaccination.applicationDate) = DATE(:applicationDate)", {
                applicationDate: data.applicationDate,
            });

        if (data.ignoreUID) {
            query.andWhere("vaccination.uid != :ignoreUID", {
                ignoreUID: data.ignoreUID,
            });
        }

        const exists = await query.getExists();

        return ResultFactory.success(exists);
    }

    async register(vaccination: VaccinationEntity): Promise<Result<VaccinationEntity>> {
        const savedVaccination = await this.vaccinationRepository.save(vaccination);

        return ResultFactory.success(savedVaccination);
    }

    async update(vaccination: VaccinationEntity): Promise<Result<VaccinationEntity>> {
        const savedVaccination = await this.vaccinationRepository.save(vaccination);

        return ResultFactory.success(savedVaccination);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.vaccinationRepository.delete(uid);

        return ResultFactory.ok();
    }
}
