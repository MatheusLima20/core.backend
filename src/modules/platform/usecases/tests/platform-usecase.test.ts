import { CreatePlatformDTO } from "../../dto/create-platform.dto";
import { UpdatePlatformDTO } from "../../dto/update-platform.dto";
import { InMemoryPlatformRepository } from "../../repositories/implementations/in-memory-platform.repository";
import { PlatformUsecase } from "../platform.usecase";

const platform: CreatePlatformDTO = {
    name: "Beautiful Lag.",
};

const platform2: CreatePlatformDTO = {
    name: "Beautiful Arm.",
};

describe("PlatformUsecase", () => {
    let repository: InMemoryPlatformRepository;

    let usecase: PlatformUsecase;

    beforeEach(() => {
        repository = new InMemoryPlatformRepository();
        usecase = new PlatformUsecase(repository);
    });

    test("Should register a platform.", async () => {
        const result = await usecase.create(platform);
        const result2 = await usecase.create(platform2);

        expect(result.name).toBe(platform.name);
        expect(result2.uid).not.toBeNull();
    });

    test("Should not create duplicated platform", async () => {
        await usecase.create({
            name: "Beautiful Lag",
        });

        await expect(
            usecase.create({
                name: "Beautiful Lag",
            }),
        ).rejects.toThrow();
    });

    test("Should update a platform", async () => {
        const result = await usecase.create(platform);
        await usecase.create(platform2);

        const updatePlatform: UpdatePlatformDTO = {
            uid: result.uid,
            isActivated: true,
            name: "Beautiful Calf.",
        };

        const updatedPlatform = await usecase.update(updatePlatform);

        expect(updatePlatform.name).toBe(updatedPlatform.name);
    });

    test("Should not updated platform duplicate name", async () => {
        await usecase.create({
            name: "Beautiful Lag",
        });
        const result = await usecase.create(platform2);

        await expect(
            usecase.update({
                uid: result.uid,
                isActivated: true,
                name: "Beautiful Lag",
            }),
        ).rejects.toThrow();
    });

    test("Should find a platform by uid ", async () => {
        const lag = await usecase.create({
            name: "Beautiful Lag",
        });

        const result = await usecase.findByUID(lag.uid);
        const fitnessUp = await usecase.findByUID("1");

        expect(result.uid).toBe(lag.uid);
        expect(fitnessUp.uid).toBe("1");
    });

    test("Should find a platform by name ", async () => {
        const lag = await usecase.create({
            name: "Beautiful Lag",
        });

        const result = await usecase.findByName(lag.name);
        const fitnessUp = await usecase.findByName("Fitness up.");

        expect(result.name).toBe(lag.name);
        expect(fitnessUp.name).toBe("Fitness up.");
    });

    test("Should find all platforms", async () => {
        await usecase.create(platform);
        await usecase.create(platform2);
        await usecase.create({
            name: "Beautiful Lag",
        });

        const result = await usecase.find();

        expect(result.every((platform) => platform.uid)).toBe(true);
    });

    test("Should delete a platform", async () => {
        const result = await usecase.create(platform);
        await usecase.create(platform2);
        await usecase.create({
            name: "Beautiful Lag",
        });

        const isDeleted = await usecase.delete(result.uid);

        const platforms = await usecase.find();

        expect(isDeleted).toBe(true);

        expect(platforms.every((platform) => platform.uid !== result.uid)).toBe(
            true,
        );
    });
});
