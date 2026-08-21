import { Result } from "@/shared/result/result";

import { PlatformProps } from "../entities/platform.props";

export interface IPlatformRepository {
    findByUID(uid: string): Promise<Result<PlatformProps | null>>;

    findByName(name: string): Promise<Result<PlatformProps | null>>;

    find(): Promise<Result<PlatformProps[]>>;

    register(platform: PlatformProps): Promise<Result<PlatformProps>>;

    update(platform: PlatformProps): Promise<Result<PlatformProps>>;

    delete(uid: string): Promise<Result<boolean>>;
}
