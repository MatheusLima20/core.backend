import { Repository } from "typeorm";

import { CreatePlatformResponseDTO } from "../../dto/create-platform.dto";
import { PlatformResponseDTO } from "../../dto/platform-response.dto";
import { UpdatePlatformResponseDTO } from "../../dto/update-platform.dto";
import { PlatformEntity } from "../../entities/platform.entities";
import { PlatformMapper } from "../../mappers/platform.mapper";
import { IPlatformRepository } from "../platform-repository.interface";

export class TypeORMPlatformRepository implements IPlatformRepository {
    constructor(private readonly repository: Repository<PlatformEntity>) {}

    async find(): Promise<PlatformResponseDTO[]> {
        const platforms = await this.repository.find();

        return PlatformMapper.toPlatformUIDResponseList(platforms);
    }

    async findByUID(uid: string): Promise<PlatformResponseDTO | null> {
        const platform = await this.repository.findOne({
            where: {
                uid,
            },
        });

        if (!platform) {
            return null;
        }

        return PlatformMapper.toPlatformUIDResponse(platform);
    }

    async findByName(name: string): Promise<PlatformResponseDTO | null> {
        const platform = await this.repository.findOne({
            where: {
                name,
            },
        });

        if (!platform) {
            return null;
        }

        return PlatformMapper.toPlatformUIDResponse(platform);
    }

    async register(platform: PlatformEntity): Promise<CreatePlatformResponseDTO | null> {
        const savedPlatform = await this.repository.save(platform);

        return savedPlatform;
    }

    async update(platform: PlatformEntity): Promise<UpdatePlatformResponseDTO | null> {
        const updatedPlatform = await this.repository.save(platform);

        return updatedPlatform;
    }

    async delete(uid: string): Promise<boolean> {
        const result = await this.repository.delete({
            uid,
        });

        return result.affected !== 0;
    }
}
