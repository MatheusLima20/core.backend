import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { AppError } from "@/shared/errors/app.error";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { FailureResult, Result, SuccessResult } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { ContentResponseDTO } from "../dtos/content-response.dto";
import { CreateContentDTO, CreateContentResponseDTO } from "../dtos/create-content.dto";
import { FindContentsDTO } from "../dtos/find-content.dto";
import { UpdateContentDTO, UpdateContentResponseDTO } from "../dtos/update-content.dto";
import { ContentEntity } from "../entities/content.entity";
import { ContentProps } from "../entities/content.props";
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
        const validation = await this.validateContentAlreadyExists(data.title);

        if (!validation.success) {
            return validation;
        }

        const content = new ContentEntity({
            ...data,
            uid: randomUUID(),
            platformUID: this.context.user.platformUID,
            createdBy: this.context.user.uid,
            updatedBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const created = await this.contentRepository.create(content);

        if (!created.success) {
            return ResultFactory.failure(new PersistenceError("Failed to create content."));
        }

        return ResultMapper.map(created, ContentMapper.toCreatedResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<ContentResponseDTO>> {
        const result = await this.contentRepository.findByUID(this.context.user.platformUID, uid);

        const content = ResultMapper.requireData(result, new ContentNotFoundError({ uid }));

        return ResultMapper.map(content, ContentMapper.toResponseDTO);
    }

    async find(filters?: FindContentsDTO): Promise<Result<ContentResponseDTO[]>> {
        const contents = await this.contentRepository.find(this.context.user.platformUID, filters);

        return ResultMapper.map(contents, ContentMapper.toResponseDTOList);
    }

    async update(data: UpdateContentDTO): Promise<Result<UpdateContentResponseDTO>> {
        const result = await this.contentRepository.findByUID(
            this.context.user.platformUID,
            data.uid
        );

        if (!result.success) {
            return result;
        }

        const oldContent = ResultMapper.requireData(
            result,
            new ContentNotFoundError({
                uid: data.uid,
            })
        );

        if (!oldContent.success) {
            return ResultFactory.failure(
                new ContentNotFoundError({
                    uid: data.uid,
                })
            );
        }

        if (data.title) {
            const validation = await this.validateContentAlreadyExists(data.title, data.uid);

            if (!validation.success) {
                return validation;
            }
        }

        const mergedContent = new ContentEntity({
            ...oldContent.data,

            ...data,
            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const updated = await this.contentRepository.update(mergedContent);

        return ResultMapper.map(updated, ContentMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const content = await this.findByUID(uid);

        if (!content.success) {
            return ResultFactory.failure(new ContentNotFoundError({ uid }));
        }

        const deleted = await this.contentRepository.delete(uid);

        if (!deleted.success) {
            return ResultFactory.failure(new PersistenceError("Failed to delete content."));
        }

        return ResultFactory.ok();
    }

    private async validateContentAlreadyExists(
        title: string,
        uid?: string
    ): Promise<FailureResult<AppError> | SuccessResult<ContentProps | null>> {
        const result = await this.contentRepository.find(this.context.user.platformUID, {
            title,
        });

        if (isFailure(result)) {
            return result;
        }

        const [content] = result.data;

        if (content && content.uid !== uid) {
            return ResultFactory.failure(new ContentAlreadyExistsError(title));
        }

        return ResultFactory.success(content);
    }
}
