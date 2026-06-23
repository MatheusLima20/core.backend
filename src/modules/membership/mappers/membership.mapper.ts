import { MembershipResponseDTO } from "../dto/membership-response.dto";
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
}