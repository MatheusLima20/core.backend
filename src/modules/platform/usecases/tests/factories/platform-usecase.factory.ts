import { InMemoryPlatformRepository } from "../../../repositories/implementations/in-memory-platform.repository";
import { PlatformUsecase } from "../../platform.usecase";

export function makePlatformUsecase(platformRepository: InMemoryPlatformRepository) {
    return {
        usecase: new PlatformUsecase(platformRepository),
    };
}
