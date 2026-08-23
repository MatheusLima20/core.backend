import { Repository } from "typeorm";

import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { PlatformEntity } from "../../entities/platform.entities";
import { PlatformProps } from "../../entities/platform.props";
import { IPlatformRepository } from "../platform-repository.interface";

export class TypeORMPlatformRepository implements IPlatformRepository {
    constructor(private readonly repository: Repository<PlatformEntity>) {}

    async find(): Promise<Result<PlatformProps[]>> {
        const platforms = await this.repository.find();

        return ResultFactory.success(platforms);
    }

    async findByUID(uid: string): Promise<Result<PlatformProps | null>> {
        const platform = await this.repository.findOne({
            where: {
                uid,
            },
        });

        return ResultFactory.success(platform ? platform : null);
    }

    async findByName(name: string): Promise<Result<PlatformProps | null>> {
        const platform = await this.repository.findOne({
            where: {
                name,
            },
        });

        return ResultFactory.success(platform ? platform : null);
    }

    async register(platform: PlatformProps): Promise<Result<PlatformProps>> {
        const savedPlatform = await this.repository.save(platform);

        return ResultFactory.success(savedPlatform);
    }

    async update(platform: PlatformProps): Promise<Result<PlatformProps>> {
        const updatedPlatform = await this.repository.save(platform);

        return ResultFactory.success(updatedPlatform);
    }

    async delete(uid: string): Promise<Result<boolean>> {
        const result = await this.repository.delete({
            uid,
        });

        return ResultFactory.success(result.affected !== 0);
    }
}
