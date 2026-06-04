import { randomUUID } from "crypto";
import { IContentRepository } from "../repositories/content-repository.interface";
import { CreateContentDTO } from "../dtos/create-content.dto";
import { UpdateContentDTO } from "../dtos/update-content.dto";
import { ContentEntity } from "../entities/content.entity";
import { ContentType } from "../enum/content.enum";
export class ContentUseCase {
    constructor(private contentRepository: IContentRepository) {}

    async create(data: CreateContentDTO) {
        const content = new ContentEntity({
            uid: randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
        });

        const result = await this.contentRepository.register(content);

        if (!result) {
            throw new Error("Content not register!");
        }

        return result;
    }

    async findByUID(uid: string) {
        const content = await this.contentRepository.findByUID(uid);

        if (!content) {
            throw new Error("Content not found!");
        }

        return content;
    }

    async findByType(type: ContentType) {
        const content = await this.contentRepository.findByType(type);

        if (!content) {
            throw new Error("Contents not found!");
        }

        return content;
    }

    async find(platformUID: string) {
        const content = await this.contentRepository.find(platformUID);

        if (!content) {
            throw new Error("Contents not found!");
        }

        return content;
    }

    async update(data: UpdateContentDTO) {
        const oldContent = await this.findByUID(data.uid);

        const mergedContent = new ContentEntity({
            ...oldContent,
            ...data,
            updatedAt: new Date(),
        });

        const content = await this.contentRepository.update(mergedContent);

        if (!content) {
            throw new Error("Content not updated!");
        }

        return content;
    }

    async delete(uid: string) {
        await this.findByUID(uid);

        const isDeleted = await this.contentRepository.delete(uid);

        if (!isDeleted) {
            throw new Error("Content not Deleted!");
        }

        return isDeleted;
    }
}
