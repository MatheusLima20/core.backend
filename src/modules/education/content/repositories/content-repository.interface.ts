import { Result } from "@/shared/result";

import { FindContentsDTO } from "../dtos/find-content.dto";
import { ContentProps } from "../entities/content.props";

export interface IContentRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<ContentProps | null>>;
    find(platformUID: string, filters?: FindContentsDTO): Promise<Result<ContentProps[]>>;
    create(user: ContentProps): Promise<Result<ContentProps>>;
    update(user: ContentProps): Promise<Result<ContentProps>>;
    delete(uid: string): Promise<Result<void>>;
}
