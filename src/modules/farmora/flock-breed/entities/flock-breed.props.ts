export interface FlockBreedProps {
    uid?: string;
    platformUID: string;
    flockUID: string;
    breedUID: string;
    quantity: number;
    createdBy: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
