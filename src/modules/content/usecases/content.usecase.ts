import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { ContentResponseDTO } from "../dtos/content-response.dto";
import { CreateContentDTO, CreateContentResponseDTO } from "../dtos/create-content.dto";
import { FindContentsDTO } from "../dtos/find-contents.dto";
import { UpdateContentDTO, UpdateContentResponseDTO } from "../dtos/update-content.dto";
import { ContentEntity } from "../entities/content.entity";
import { ContentAlreadyExistsError } from "../errors/content-already-exists.error";
import { ContentNotFoundError } from "../errors/content-not-found.error";
import { ContentMapper } from "../mappers/content.mapper";
import { IContentRepository } from "../repositories/content-repository.interface";

export class ContentUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly contentRepository: IContentRepository
    ) {}

    async create(data: CreateContentDTO): Promise<Result<CreateContentResponseDTO>> {
        const validation = await this.validateContentAlreadyExists(data.name);

        if (!validation.success) {
            return validation;
        }

        const content = new ContentEntity({
            ...data,
            platformUID: this.context.user.platformUID,

            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: this.context.user.uid,
        });

        const created = await this.contentRepository.register(content);

        if (!created.success) {
            return ResultFactory.failure(new PersistenceError("Failed to create content."));
        }

        return ResultMapper.map(created, ContentMapper.toCreatedResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<ContentResponseDTO>> {
        const result = await this.contentRepository.findByUID(uid, this.context.user.platformUID);

        const content = ResultMapper.requireData(result, new ContentNotFoundError({ uid }));

        return ResultMapper.map(content, ContentMapper.toResponseDTO);
    }

    async find(filters?: FindContentsDTO): Promise<Result<PaginationResult<ContentResponseDTO>>> {
        const result = await this.contentRepository.find(filters, this.context.user.platformUID);

        if (!result.success) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch contents."));
        }

        return ResultMapper.map(result, (pagination) => ({
            ...pagination,
            data: ContentMapper.toResponseDTOList(pagination.data),
        }));
    }

    async update(data: UpdateContentDTO): Promise<Result<UpdateContentResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (!existing.success) {
            return existing;
        }

        const validation = await this.validateContentAlreadyExists(
            data.name ?? existing.data.name,
            data.uid
        );

        if (!validation.success) {
            return validation;
        }

        const content = new ContentEntity({
            ...existing.data,
            ...data,
            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const updated = await this.contentRepository.update(content);

        if (!updated.success) {
            return ResultFactory.failure(new PersistenceError("Failed to update content."));
        }

        return ResultMapper.map(updated, ContentMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (!existing.success) {
            return ResultFactory.failure(new ContentNotFoundError({ uid }));
        }

        const deleted = await this.contentRepository.delete(uid);

        if (!deleted.success) {
            return ResultFactory.failure(new PersistenceError("Failed to delete content."));
        }

        return ResultFactory.ok();
    }

    private async validateContentAlreadyExists(
        name?: string | null,
        uid?: string
    ): Promise<Result<ContentResponseDTO | null>> {
        if (!name) {
            return ResultFactory.success(null);
        }

        const result = await this.contentRepository.find(
            {
                name,
            },
            this.context.user.platformUID
        );

        if (isFailure(result)) {
            return result;
        }

        const [content] = result.data.data;

        if (content && content.uid !== uid) {
            return ResultFactory.failure(new ContentAlreadyExistsError({ name }));
        }

        return ResultFactory.success(content ? ContentMapper.toResponseDTO(content) : null);
    }
}
