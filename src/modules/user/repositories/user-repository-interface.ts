import { CreateUserResponseDTO } from "../dtos/create-user.dto";
import { UpdateUserResponseDTO } from "../dtos/update-user.dto";
import { UserResponseDTO } from "../dtos/user-response.dto copy";
import { UserProps } from "../entities/user.props";
import { UserType } from "../enum/user-type.enum";

export interface IUserRepository {
    findByUID(uid: string): Promise<UserResponseDTO | null>;
    findByEmail(email: string): Promise<UserResponseDTO | null>;
    findByType(type: UserType): Promise<UserResponseDTO[]>;
    find(platform: string): Promise<UserResponseDTO[]>;
    register(user: UserProps): Promise<CreateUserResponseDTO | null>;
    update(user: UserProps): Promise<UpdateUserResponseDTO | null>;
    delete(uid: string): Promise<boolean>;
}
