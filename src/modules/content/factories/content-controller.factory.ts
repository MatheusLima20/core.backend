import { dataSource } from "@/services/database/database";
import { LocalFileStorage } from "@/services/storage/local-file-storage";
import { RequestContext } from "@/shared/context/request-context";

import { ContentController } from "../controller/content.controller";
import { ContentEntity } from "../entities/content.entity";
import { TypeORMContentRepository } from "../repositories/implementations/type-orm-content.repository";
import { ContentUsecase } from "../usecases/content.usecase";

export function makeContentController(context: RequestContext) {
    const contentRepository = new TypeORMContentRepository(dataSource.getRepository(ContentEntity));

    const fileStorage = new LocalFileStorage();

    const usecase = new ContentUsecase(context, contentRepository, fileStorage);

    return new ContentController(usecase);
}
