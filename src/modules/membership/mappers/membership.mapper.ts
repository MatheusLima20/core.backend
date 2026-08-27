import { MembershipResponseDTO } from "../dto/membership-response.dto";
import { MembershipEntity } from "../entities/membership.entity";
import { MembershipProps } from "../entities/membership.props";

export class MembershipMapper {
    static toDTO(props: MembershipProps): MembershipResponseDTO {
        return {
            uid: props.uid,
            userUID: props.userUID,
            platformUID: props.platformUID,
            role: props.role,
            createdAt: props.createdAt,
        };
    }

    static toEntity(props: MembershipProps): MembershipEntity {
        const entity = new MembershipEntity();

        entity.uid = props.uid;
        entity.userUID = props.userUID;
        entity.platformUID = props.platformUID;
        entity.role = props.role;
        entity.createdAt = props.createdAt;

        return entity;
    }

    static toDomain(entity: MembershipEntity): MembershipProps {
        return {
            uid: entity.uid,
            userUID: entity.userUID,
            platformUID: entity.platformUID,
            role: entity.role,
            createdAt: entity.createdAt,
        };
    }
}
