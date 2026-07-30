import { CreateFlockDTO } from "@/modules/farmora/flock/flock/dtos/create-flock.dto";
import { FlockUsecase } from "@/modules/farmora/flock/flock/usecases/flock.usecase";
import { setupFlock } from "@/modules/farmora/flock/flock/usecases/tests/setup/flock-tests.setup";

export async function createFlockForProduction(flockUsecase: FlockUsecase, data: CreateFlockDTO) {
    return setupFlock(flockUsecase, data);
}
