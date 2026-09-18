import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { ContentController } from "../controller/content.controller";
import { ContentEntity } from "../entities/content.entity";
import { TypeORMContentRepository } from "../repositories/implementations/type-orm-content.repository";
import { ContentUsecase } from "../usecases/content.usecase";

export function makeContentController(context: RequestContext) {
    const contentRepository = new TypeORMContentRepository(dataSource.getRepository(ContentEntity));

    const usecase = new ContentUsecase(context, contentRepository);

    return new ContentController(usecase);
}
