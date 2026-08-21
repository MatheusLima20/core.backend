import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { PlatformAlreadyExistsError } from "../../errors/platform-already-exists.error";
import { PlatformUsecase } from "../platform.usecase";
import { makePlatform, platform1, platform2 } from "./factories/platform.factory";
import { setupPlatform, setupPlatforms } from "./setup/platform.setup";
import { scenario } from "./setup/platform.test-builder";

describe("PlatformUsecase", () => {
    let platformUsecase: PlatformUsecase;

    beforeEach(() => {
        const context = scenario().createUsecases().build();

        platformUsecase = context.platformUsecases[0];
    });

    test("Should register a platform", async () => {
        const result = expectSuccess(await platformUsecase.create(platform1));

        expect(result.name).toBe(platform1.name);
        expect(result.category).toBe(platform1.category);
        expect(result.uid).not.toBeNull();
    });

    test("Should not create duplicated platform", async () => {
        await setupPlatform(platformUsecase, platform1);

        expectFailure(await platformUsecase.create(platform1), PlatformAlreadyExistsError);
    });

    test("Should update a platform", async () => {
        const platform = await setupPlatform(platformUsecase, platform1);

        await setupPlatform(platformUsecase, platform2);

        const result = expectSuccess(
            await platformUsecase.update({
                uid: platform.uid,
                isActivated: true,
                name: "Beautiful Calf.",
                updatedBy: "1",
            })
        );

        expect(result.name).toBe("Beautiful Calf.");
        expect(result.uid).toBe(platform.uid);
    });

    test("Should not update platform with duplicated name", async () => {
        await setupPlatform(platformUsecase, platform1);

        const platform = await setupPlatform(platformUsecase, platform2);

        const result = await platformUsecase.update({
            uid: platform.uid,
            isActivated: true,
            name: platform1.name,
            updatedBy: "1",
        });

        const error = expectFailure(result, PlatformAlreadyExistsError);

        expect(error).toBeInstanceOf(PlatformAlreadyExistsError);
    });

    test("Should find a platform by uid", async () => {
        const platform = await setupPlatform(platformUsecase, platform1);

        const result = expectSuccess(await platformUsecase.findByUID(platform.uid));

        expect(result?.uid).toBe(platform.uid);
        expect(result?.name).toBe(platform.name);
    });

    test("Should return failure when platform uid does not exist", async () => {
        const result = expectSuccess(await platformUsecase.findByUID("not-found"));

        expect(result).toBe(null);
    });

    test("Should find a platform by name", async () => {
        const platform = await setupPlatform(platformUsecase, platform1);

        const result = expectSuccess(await platformUsecase.findByName(platform.name));

        expect(result).not.toBeNull();
        expect(result?.name).toBe(platform.name);
        expect(result?.uid).toBe(platform.uid);
    });

    test("Should return null when platform name does not exist", async () => {
        const result = expectSuccess(await platformUsecase.findByName("Platform inexistente"));

        expect(result).toBeNull();
    });

    test("Should find all platforms", async () => {
        await setupPlatforms(
            platformUsecase,
            platform1,
            platform2,
            makePlatform({
                name: "Beautiful Lag",
            })
        );

        const result = expectSuccess(await platformUsecase.find());

        expect(result).toHaveLength(5);
        expect(result.every((platform) => platform.uid)).toBe(true);
    });

    test("Should delete a platform", async () => {
        const platform = await setupPlatform(platformUsecase, platform1);

        await setupPlatforms(
            platformUsecase,
            platform2,
            makePlatform({
                name: "Beautiful Lag",
            })
        );

        const result = expectSuccess(await platformUsecase.delete(platform.uid));

        expect(result).toBe(true);

        const platforms = expectSuccess(await platformUsecase.find());

        expect(platforms.every((item) => item.uid !== platform.uid)).toBe(true);
    });
});
