import { makePlatformUsecase } from "../factories/platform-usecase.factory";
import { TestPlatformContext } from "./test-platform.context";

export class TestBuilder {
    private testContext = new TestPlatformContext();

    createUsecases() {
        this.testContext.platformUsecases = [
            makePlatformUsecase(this.testContext.platformRepository).usecase,
        ];

        return this;
    }

    build() {
        return {
            platformUsecases: this.testContext.platformUsecases,

            repositories: {
                platform: this.testContext.platformRepository,
            },
        };
    }
}

export function scenario() {
    return new TestBuilder();
}
