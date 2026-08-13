import { NutritionProps } from "./nutrition.props";

export class NutritionEntity implements NutritionProps {
    uid!: string;
    name!: string;
    startWeek!: number;
    endWeek!: number;
    minimumCrudeProtein!: number;
    maximumCrudeProtein!: number;
    metabolizableEnergy?: number | undefined;
    crudeFiber?: number | undefined;
    calcium?: number | undefined;
    phosphorus?: number | undefined;
    sodium?: number | undefined;
    lysine?: number | undefined;
    methionine?: number | undefined;

    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: NutritionProps) {
        Object.assign(this, props);
    }
}
