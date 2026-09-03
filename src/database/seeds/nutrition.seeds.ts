import { DataSource } from "typeorm";

import { NutritionEntity } from "@/modules/farmora/nutrition/entities/nutrition.entity";

export async function seedNutrition(dataSource: DataSource): Promise<void> {
    const nutritionRepository = dataSource.getRepository(NutritionEntity);

    const nutritious = nutritionRepository.create([
        /** Cria e Recria */

        {
            uid: "nut_47d47f8e-c769-4686-a248-739156ae2e48",
            name: "Start",
            startWeek: 0,
            endWeek: 5,

            minimumCrudeProtein: 20.0,
            maximumCrudeProtein: 21.0,

            metabolizableEnergy: 2900,
            crudeFiber: 2.5,
            calcium: 1.0,
            phosphorus: 0.45,
            sodium: 0.17,
            lysine: 1.12,
            methionine: 0.51,
        },

        {
            uid: "nut_74a545d0-a5ef-49eb-803e-472081e1c7c2",
            name: "Crescimento",
            startWeek: 6,
            endWeek: 10,

            minimumCrudeProtein: 18.0,
            maximumCrudeProtein: 19.0,

            metabolizableEnergy: 2800,
            crudeFiber: 2.5,
            calcium: 1.0,
            phosphorus: 0.4,
            sodium: 0.16,
            lysine: 0.97,
            methionine: 0.45,
        },

        {
            uid: "nut_7bac5ed2-549b-4192-bb69-a7f6fb04fe77",
            name: "Desenvolvimento",
            startWeek: 11,
            endWeek: 15,

            minimumCrudeProtein: 16.0,
            maximumCrudeProtein: 17.0,

            metabolizableEnergy: 2700,
            crudeFiber: 5.0,
            calcium: 0.95,
            phosphorus: 0.37,
            sodium: 0.16,
            lysine: 0.75,
            methionine: 0.35,
        },

        {
            uid: "nut_0d4ad600-c78b-4fc1-8612-c6a857fc64ba",
            name: "Pré-postura",
            startWeek: 16,
            endWeek: 17,

            minimumCrudeProtein: 16.0,
            maximumCrudeProtein: 17.0,

            metabolizableEnergy: 2700,
            crudeFiber: 3.5,
            calcium: 2.2,
            phosphorus: 0.42,
            sodium: 0.16,
            lysine: 0.81,
            methionine: 0.41,
        },

        // ============================================================
        // POSTURA
        // ============================================================

        {
            uid: "nut_c6054f7b-1868-42e0-bdbe-b857c614fb19",
            name: "Postura 1",
            startWeek: 18,
            endWeek: 28,

            minimumCrudeProtein: 16.3,
            maximumCrudeProtein: 19.5,

            crudeFiber: 3.5,
            calcium: 3.5,
            phosphorus: 0.35,
            sodium: 0.16,
            lysine: 0.8,
            methionine: 0.41,
        },

        {
            uid: "nut_24c9bac4-f4da-49bc-9789-b427a782c644",
            name: "Postura 2",
            startWeek: 28,
            endWeek: 45,

            minimumCrudeProtein: 15.4,
            maximumCrudeProtein: 18.5,

            crudeFiber: 3.5,
            calcium: 3.5,
            phosphorus: 0.33,
            sodium: 0.16,
            lysine: 0.75,
            methionine: 0.38,
        },

        {
            uid: "nut_25da4033-a39d-4285-846c-71e0a8ab9c67",
            name: "Postura 3",
            startWeek: 45,
            endWeek: 70,

            minimumCrudeProtein: 15.0,
            maximumCrudeProtein: 18.0,

            crudeFiber: 3.5,
            calcium: 3.75,
            phosphorus: 0.32,
            sodium: 0.16,
            lysine: 0.75,
            methionine: 0.38,
        },

        {
            uid: "nut_c1477939-f88f-4543-a665-982f3d90a778",
            name: "Postura 4",
            startWeek: 70,
            endWeek: 100,

            minimumCrudeProtein: 14.6,
            maximumCrudeProtein: 17.5,

            crudeFiber: 3.5,
            calcium: 4.0,
            phosphorus: 0.3,
            sodium: 0.16,
            lysine: 0.75,
            methionine: 0.38,
        },
    ]);

    await nutritionRepository.upsert(nutritious, ["uid"]);
}
