import { InventoryCategory } from "@/modules/farmora/inventory/enums/inventory-category.enum";
import { InventoryItemNotFoundError } from "@/modules/farmora/inventory/errors/inventory-item-not-found.error";
import { IInventoryItemRepository } from "@/modules/farmora/inventory/repositories/inventory-item-repository.interface";
import { RequestContext } from "@/shared/context/request-context";
import { FlockClosedError } from "@/shared/errors/flock-closed.error";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { FlockStatus } from "../../flock/enums/flock-status.enum";
import { FlockNotFoundError } from "../../flock/errors/flock-not-found.error";
import { IFlockRepository } from "../../flock/repositories/flock-repository.interface";
import { CreateVaccinationDTO, CreateVaccinationResponseDTO } from "../dtos/create-vaccination.dto";
import { FindVaccinationsDTO } from "../dtos/find-vaccination.dto";
import { UpdateVaccinationDTO, UpdateVaccinationResponseDTO } from "../dtos/update-vaccination.dto";
import { ResponseVaccinationDTO } from "../dtos/vaccination-response.dto";
import { VaccinationEntity } from "../entities/vaccination.entity";
import { VaccinationErrorCode } from "../enums/vaccination.error-code.enum";
import { DuplicateVaccinationError } from "../errors/duplicate-vaccination.error";
import { InvalidVaccinationError } from "../errors/invalid-vaccination.error";
import { VaccinationNotFoundError } from "../errors/vaccination.not-found.error";
import { VaccinationMapper } from "../mappers/vaccination.mapper";
import { IVaccinationRepository } from "../repositories/vaccination-repository.interface";

export class VaccinationUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly vaccinationRepository: IVaccinationRepository,
        private readonly flockRepository: IFlockRepository,
        private readonly inventoryItemRepository: IInventoryItemRepository
    ) {}

    async create(data: CreateVaccinationDTO): Promise<Result<CreateVaccinationResponseDTO>> {
        const validation = await this.validateVaccination(
            data.flockUID,
            data.itemUID,
            data.applicationDate
        );

        if (isFailure(validation)) {
            return validation;
        }

        const vaccination = new VaccinationEntity({
            platformUID: this.context.user.platformUID,

            createdBy: this.context.user.uid,
            updatedBy: undefined,

            createdAt: new Date(),
            updatedAt: new Date(),

            ...data,
        });

        const created = await this.vaccinationRepository.register(vaccination);

        if (isFailure(created)) {
            return ResultFactory.failure(new PersistenceError("Failed to create vaccination."));
        }

        return ResultMapper.map(created, VaccinationMapper.toCreateResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<ResponseVaccinationDTO | null>> {
        const result = await this.vaccinationRepository.findByUID(
            this.context.user.platformUID,
            uid
        );

        if (isFailure(result) || !result.data) {
            return ResultFactory.success(null);
        }

        return ResultMapper.map(
            ResultFactory.success(result.data),
            VaccinationMapper.toResponseDTO
        );
    }

    async find(
        filters?: FindVaccinationsDTO
    ): Promise<Result<PaginationResult<ResponseVaccinationDTO>>> {
        const result = await this.vaccinationRepository.find(
            this.context.user.platformUID,
            filters
        );

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch vaccinations."));
        }

        return ResultMapper.map(result, (pagination) => ({
            ...pagination,
            data: VaccinationMapper.toResponseDTOList(pagination.data),
        }));
    }

    async update(data: UpdateVaccinationDTO): Promise<Result<UpdateVaccinationResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (isFailure(existing)) {
            return existing;
        }

        const vaccination = ResultMapper.requireData(
            existing,
            new VaccinationNotFoundError(data.uid)
        );

        if (isFailure(vaccination)) {
            return vaccination;
        }

        const updatedVaccination = new VaccinationEntity({
            ...vaccination.data,
            ...data,

            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const validation = await this.validateVaccination(
            updatedVaccination.flockUID,
            updatedVaccination.itemUID,
            updatedVaccination.applicationDate,
            updatedVaccination.uid
        );

        if (isFailure(validation)) {
            return validation;
        }

        const updated = await this.vaccinationRepository.update(updatedVaccination);

        if (isFailure(updated)) {
            return ResultFactory.failure(new PersistenceError("Failed to update vaccination."));
        }

        return ResultMapper.map(updated, VaccinationMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (isFailure(existing) || existing.data === null) {
            return ResultFactory.failure(new VaccinationNotFoundError(uid));
        }

        const deleted = await this.vaccinationRepository.delete(uid);

        if (isFailure(deleted)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete vaccination."));
        }

        return ResultFactory.ok();
    }

    private async validateVaccination(
        flockUID: string,
        itemUID: string,
        applicationDate: Date,
        uid?: string
    ): Promise<
        Result<
            void,
            | FlockNotFoundError
            | FlockClosedError
            | InventoryItemNotFoundError
            | DuplicateVaccinationError
            | VaccinationNotFoundError
        >
    > {
        const flock = await this.flockRepository.findByUID(this.context.user.platformUID, flockUID);

        const existingFlock = ResultMapper.requireData(
            flock,
            new FlockNotFoundError({
                uid: flockUID,
            })
        );

        if (isFailure(existingFlock)) {
            return ResultFactory.failure(
                new FlockNotFoundError({
                    uid: flockUID,
                })
            );
        }

        if (existingFlock.data.status === FlockStatus.CLOSED) {
            return ResultFactory.failure(new FlockClosedError());
        }

        const item = await this.inventoryItemRepository.findByUID(
            this.context.user.platformUID,
            itemUID
        );

        const existingItem = ResultMapper.requireData(
            item,
            new InventoryItemNotFoundError({
                uid: itemUID,
            })
        );

        if (isFailure(existingItem)) {
            return ResultFactory.failure(
                new InventoryItemNotFoundError({
                    uid: itemUID,
                })
            );
        }

        if (existingItem.data.category !== InventoryCategory.VACCINE) {
            return ResultFactory.failure(
                new InvalidVaccinationError(VaccinationErrorCode.INVALID_ITEM)
            );
        }

        const duplicated = await this.vaccinationRepository.exists(this.context.user.platformUID, {
            flockUID,
            itemUID,
            applicationDate,
            ignoreUID: uid,
        });

        if (isFailure(duplicated)) {
            return duplicated;
        }

        if (duplicated.data) {
            return ResultFactory.failure(
                new DuplicateVaccinationError({
                    flockUID,
                    itemUID,
                    vaccinationDate: applicationDate,
                })
            );
        }

        return ResultFactory.ok();
    }
}
