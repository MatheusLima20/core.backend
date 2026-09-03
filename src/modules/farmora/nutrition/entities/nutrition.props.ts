export interface NutritionProps {
    uid?: string;

    name: string;

    startWeek: number;

    endWeek: number;

    minimumCrudeProtein: number;

    maximumCrudeProtein: number;

    metabolizableEnergy?: number;

    crudeFiber?: number;

    calcium?: number;

    phosphorus?: number;

    sodium?: number;

    lysine?: number;

    methionine?: number;

    createdAt?: Date;

    updatedAt?: Date;
}
