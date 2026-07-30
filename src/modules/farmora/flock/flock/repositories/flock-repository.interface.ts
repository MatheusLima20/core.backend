import { Result } from "@/shared/result";

import { FindFlocksDTO } from "../dtos/find-flock.dto";
import { FlockProps } from "../entities/flock.props";

export interface IFlockRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<FlockProps | null>>;

    findByName(platformUID: string, name: string): Promise<Result<FlockProps[]>>;

    find(platformUID: string, filters?: FindFlocksDTO): Promise<Result<FlockProps[]>>;

    register(flock: FlockProps): Promise<Result<FlockProps>>;

    update(flock: FlockProps): Promise<Result<FlockProps>>;

    delete(uid: string): Promise<Result<void>>;
}
