import { CreateContentDTO } from "../../dtos/create-content.dto";
import { UpdateContentDTO } from "../../dtos/update-content.dto";
import { ContentType } from "../../enum/content.enum";
import { InMemoryContentRepository } from "../../repositories/implementations/in-memory-content.repository";
import { ContentUseCase } from "../content.usecase";

describe("ContentUsecase", () => {
    const content: CreateContentDTO = {
        platformUID: "1",
        amount: 20,
        description: "Why Protein Sale.",
        photo: null,
        type: ContentType.FILE,
        userUID: null,
        value: 10,
    };

    const content2: CreateContentDTO = {
        ...content,
        description: "Creatine Sale.",
        amount: 5,
        value: 10,
    };

    const makeContent = (
        data?: Partial<CreateContentDTO>,
    ): CreateContentDTO => ({
        ...content,
        ...data,
    });

    let repository: InMemoryContentRepository;

    let useCase: ContentUseCase;

    beforeEach(() => {
        repository = new InMemoryContentRepository();

        useCase = new ContentUseCase(repository);
    });

    test("Should register a content", async () => {
        const result = await useCase.create(content);
        const result2 = await useCase.create(content2);

        expect(content.description).toBe(result.description);
        expect(content2.description).toBe(result2.description);
    });

    test("Should update a content", async () => {
        const result = await useCase.create(content);
        await useCase.create(content2);

        const newContent: UpdateContentDTO = {
            uid: result.uid,
            description: "Creatine Sale. Fifty percent off.",
            amount: 10,
            value: 10,
        };

        const resultUpdated = await useCase.update(newContent);

        expect(newContent.value).toBe(resultUpdated.value);
        expect(newContent.uid).toBe(resultUpdated.uid);
    });

    test("Should find a content by uid", async () => {
        await useCase.create(content);
        await useCase.create(content2);
        const expense = await useCase.create(
            makeContent({
                description: "Buy a gym equipment to training arms.",
                type: ContentType.FILE,
                value: 200,
                amount: 2,
            }),
        );

        const result = await useCase.findByUID(expense.uid);

        expect(expense.uid).toBe(result.uid);
    });

    test("Should find all platform contents", async () => {
        await useCase.create(content);
        await useCase.create(content2);
        await useCase.create(
            makeContent({
                description: "Buy a gym equipment to training arms.",
                type: ContentType.FILE,
                value: 200,
                amount: 2,
                platformUID: "2",
            }),
        );

        const result = await useCase.find("1");
        const result2 = await useCase.find("2");

        expect(result).toHaveLength(3);
        expect(result2).toHaveLength(1);

        expect(result.every((content) => content.platformUID === "1")).toBe(true);
        expect(result2.every((content) => content.platformUID === "2")).toBe(true);
    });

    test("Should find all contents by type", async () => {
        await useCase.create(content);
        await useCase.create(content2);
        await useCase.create(
            makeContent({
                description: "Buy a gym equipment to training arms.",
                type: ContentType.PROFILE,
                value: 200,
                amount: 2,
                platformUID: "2",
            }),
        );

        const result = await useCase.findByType(ContentType.PROFILE);
        const result2 = await useCase.findByType(ContentType.FILE);

        expect(result).toHaveLength(1);
        expect(result2).toHaveLength(3);

        expect(
            result.every((content) => content.type === ContentType.PROFILE),
        ).toBe(true);
        expect(
            result2.every((content) => content.type === ContentType.FILE),
        ).toBe(true);
    });

    test("Should to delete a content", async () => {
        const result = await useCase.create(content);
        await useCase.create(content2);

        const contentsBefore = await useCase.find(content.platformUID);

        const isDeletedContent = await useCase.delete(result.uid);

        const contentsAfter = await useCase.find(content.platformUID);

        expect(isDeletedContent).toBe(true);
        expect(contentsBefore.length).not.toEqual(contentsAfter.length);
    });
});
