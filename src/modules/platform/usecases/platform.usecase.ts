import { randomUUID } from "crypto";
import { CreatePlatformDTO } from "../dto/create-platform.dto";
import { IPlatformRepository } from "../repositories/platform-repository.interface";
import { PlatformEntity } from "../entities/platform.entities";
import { UpdatePlatformDTO } from "../dto/update-platform.dto";

export class PlatformUsecase {
    constructor(private platformRepository: IPlatformRepository) {}

    async create(data: CreatePlatformDTO) {
        await this.validatePlatformAlreadyExists(data.name);

        const platform = new PlatformEntity({
            uid: randomUUID(),
            isActivated: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
        });

        const result = await this.platformRepository.register(platform);

        if (!result) {
            throw new Error("Platform not register!");
        }

        return result;
    }

    async findByUID(uid: string) {
        const platform = await this.platformRepository.findByUID(uid);

        if (!platform) {
            throw new Error("Platform not found!");
        }

        return platform;
    }

    async findByName(name: string) {
        const platform = await this.platformRepository.findByName(name);

        if (!platform) {
            throw new Error("Platform not found!");
        }

        return platform;
    }

    async find() {
        const platforms = await this.platformRepository.find();

        if (!platforms) {
            throw new Error("Platforms not found!");
        }

        return platforms;
    }

    async update(data: UpdatePlatformDTO) {
        await this.validatePlatformAlreadyExists(data.name, data.uid);

        const oldPlatform = await this.findByUID(data.uid);

        const mergedPlatform = new PlatformEntity({
            ...oldPlatform,
            ...data,
            updatedAt: new Date(),
        });

        const result = await this.platformRepository.update(mergedPlatform);

        if (!result) {
            throw new Error("Platform not updated!");
        }

        return result;
    }

    async delete(uid: string) {
        await this.findByUID(uid);

        const isDeleted = await this.platformRepository.delete(uid);

        if (!isDeleted) {
            throw new Error("Platform not deleted!");
        }

        return isDeleted;
    }

    private async validatePlatformAlreadyExists(name: string, uid?: string) {
        const platform = await this.platformRepository.findByName(name);

        if (platform && platform.uid !== uid) {
            throw new Error("Platform already exists!");
        }
    }
}
