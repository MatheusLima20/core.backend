import { FlockBreedEntity } from "../entities/flock-breed.entity";

export type ResponseFlockBreedDTO = Pick<
    FlockBreedEntity,
    | "uid"
    | "platformUID"
    | "flockUID"
    | "breedUID"
    | "quantity"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
