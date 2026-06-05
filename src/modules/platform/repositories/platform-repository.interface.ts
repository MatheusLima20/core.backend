import { CreatePlatformResponseDTO } from "../dto/create-platform.dto";
import { PlatformResponseDTO } from "../dto/platform-response.dto";
import { UpdatePlatformResponseDTO } from "../dto/update-platform.dto";
import { PlatformProps } from "../entities/platform.props";

export interface IPlatformRepository {
    findByUID(uid: string): Promise<PlatformResponseDTO | null>;
    findByName(name: string): Promise<PlatformResponseDTO | null>;
    find(): Promise<PlatformResponseDTO[]>;
    register(user: PlatformProps): Promise<CreatePlatformResponseDTO | null>;
    update(user: PlatformProps): Promise<UpdatePlatformResponseDTO | null>;
    delete(uid: string): Promise<boolean>;
}
