import { InMemoryPlatformRepository } from "../../../repositories/implementations/in-memory-platform.repository";
import { PlatformUsecase } from "../../platform.usecase";

export class TestPlatformContext {
    platformRepository = new InMemoryPlatformRepository();

    platformUsecases: PlatformUsecase[] = [];
}
