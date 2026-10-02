import { BreedEntity } from "../../breed/entities/breed.entity";
import { FlockEntity } from "../entities/flock.entity";

export interface FlockWithBreed {
    flock: FlockEntity;
    breed: Pick<BreedEntity, "name" | "urlImage">;
}
