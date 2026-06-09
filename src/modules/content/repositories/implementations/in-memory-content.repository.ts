import { ContentResponseDTO } from "../../dtos/content-response.dto";
import { CreateContentResponseDTO } from "../../dtos/create-content.dto";
import { UpdateContentResponseDTO } from "../../dtos/update-content.dto";
import { ContentEntity } from "../../entities/content.entity";
import { ContentType } from "../../enum/content.enum";
import { ContentMapper } from "../../mappers/content.mapper";
import { IContentRepository } from "../content-repository.interface";

export class InMemoryContentRepository implements IContentRepository {
    contents: ContentEntity[] = [
        {
            uid: "1",
            platformUID: "1",
            amount: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            description: "Why Sale.",
            photo: null,
            type: ContentType.FILE,
            userUID: null,
            value: 20,
        }
    ];

    async findByType(type: ContentType): Promise<ContentResponseDTO[]> {
        const contents = this.contents.filter(
            (content) => content.type === type,
        );

        return ContentMapper.toPlatformUIDResponseList(contents);
    }
    async find(platformUID: string): Promise<ContentResponseDTO[]> {
        const contents = this.contents.filter(
            (content) => content.platformUID === platformUID,
        );

        return ContentMapper.toPlatformUIDResponseList(contents);
    }

    async findByUID(uid: string): Promise<ContentResponseDTO | null> {
        return this.contents.find((content) => content.uid === uid) || null;
    }

    async register(
        content: ContentEntity,
    ): Promise<CreateContentResponseDTO | null> {
        this.contents.push(content);

        return content;
    }

    async update(
        content: ContentEntity,
    ): Promise<UpdateContentResponseDTO | null> {
        const index = this.contents.findIndex(
            (oldContent) => oldContent.uid === content.uid,
        );

        const newContent = (this.contents[index] = content);

        return newContent;
    }

    async delete(uid: string): Promise<boolean> {
        const index = this.contents.findIndex(
            (oldContent) => oldContent.uid === uid,
        );

        const removedContent = this.contents.splice(index, 1);

        return !!removedContent;
    }
}
