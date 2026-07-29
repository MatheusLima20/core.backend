import { Result } from "@/shared/result";

import { FindBreedsDTO } from "../dtos/find-breed.dto";
import { BreedProps } from "../entities/breed.props";

export interface IBreedRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<BreedProps | null>>;

    findByName(platformUID: string, name: string): Promise<Result<BreedProps | null>>;

    find(platformUID: string, filters?: FindBreedsDTO): Promise<Result<BreedProps[]>>;

    register(breed: BreedProps): Promise<Result<BreedProps>>;

    update(breed: BreedProps): Promise<Result<BreedProps>>;

    delete(uid: string): Promise<Result<void>>;
}
