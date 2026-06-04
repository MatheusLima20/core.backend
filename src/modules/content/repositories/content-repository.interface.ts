import { ContentResponseDTO } from "../dtos/content-response.dto";
import { CreateContentResponseDTO } from "../dtos/create-content.dto";
import { UpdateContentResponseDTO } from "../dtos/update-content.dto";
import { ContentProps } from "../entities/content.props";
import { ContentType } from "../enum/content.enum";

export interface IContentRepository {
    findByUID(uid: string): Promise<ContentResponseDTO | null>;
    findByType(type: ContentType): Promise<ContentResponseDTO[]>;
    find(platformUID: string): Promise<ContentResponseDTO[]>;
    register(user: ContentProps): Promise<CreateContentResponseDTO | null>;
    update(user: ContentProps): Promise<UpdateContentResponseDTO | null>;
    delete(uid: string): Promise<boolean>;
}
