import { dataSource } from "@/services/database/database";

import { seedNutrition } from "./nutrition.seeds";

async function runSeeds(): Promise<void> {
    try {
        await dataSource.initialize();

        await seedNutrition(dataSource);

        console.log("Seeds executed successfully.");
    } catch (error) {
        console.error("Failed to execute seeds:", error);
        process.exit(1);
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    }
}

runSeeds();
