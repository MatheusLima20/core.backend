import { CreatePlatformResponseDTO } from "../../dto/create-platform.dto";
import { PlatformResponseDTO } from "../../dto/platform-response.dto";
import { UpdatePlatformResponseDTO } from "../../dto/update-platform.dto";
import { PlatformEntity } from "../../entities/platform.entities";
import { PlatformMapper } from "../../mappers/platform.mapper";
import { IPlatformRepository } from "../platform-repository.interface";

export class InMemoryPlatformRepository implements IPlatformRepository {
    platforms: PlatformEntity[] = [
        {
            uid: "1",
            name: "Fitness up.",
            isActivated: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            uid: "2",
            name: "Ultimate Body Builder.",
            isActivated: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    async find(): Promise<PlatformResponseDTO[]> {
        return PlatformMapper.toPlatformUIDResponseList(this.platforms);
    }

    async findByUID(uid: string): Promise<PlatformResponseDTO | null> {
        return this.platforms.find((platform) => platform.uid === uid) || null;
    }

    async findByName(name: string): Promise<PlatformResponseDTO | null> {
        return (
            this.platforms.find((platform) => platform.name === name) || null
        );
    }

    async register(
        platform: PlatformEntity,
    ): Promise<CreatePlatformResponseDTO | null> {
        this.platforms.push(platform);

        return platform;
    }

    async update(
        platform: PlatformEntity,
    ): Promise<UpdatePlatformResponseDTO | null> {
        const index = this.platforms.findIndex(
            (oldPlatform) => oldPlatform.uid === platform.uid,
        );

        const newPlatform = (this.platforms[index] = platform);

        return newPlatform;
    }

    async delete(uid: string): Promise<boolean> {
        const index = this.platforms.findIndex(
            (oldPlatform) => oldPlatform.uid === uid,
        );

        const removedPlatform = this.platforms.splice(index, 1);

        return !!removedPlatform;
    }
}
