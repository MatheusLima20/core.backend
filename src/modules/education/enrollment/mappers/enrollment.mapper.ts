import { CreateEnrollmentResponseDTO } from "../dtos/create-enrollment.dto";
import { EnrollmentResponseDTO } from "../dtos/enrollment-response.dto";
import { UpdateEnrollmentResponseDTO } from "../dtos/update-enrollment.dto";
import { EnrollmentProps } from "../entities/enrollment.props";

export const EnrollmentMapper = {
    toCreatedResponseDTO: (enrollment: EnrollmentProps): CreateEnrollmentResponseDTO => {
        return {
            uid: enrollment.uid,
            platformUID: enrollment.platformUID,
            userUID: enrollment.userUID,
            courseUID: enrollment.courseUID,
            enrolledAt: enrollment.enrolledAt,
            completedAt: enrollment.completedAt,
            expiresAt: enrollment.expiresAt,
            status: enrollment.status,
            createdBy: enrollment.createdBy,
            createdAt: enrollment.createdAt,
            updatedAt: enrollment.updatedAt,
        };
    },

    toUpdatedResponseDTO: (enrollment: EnrollmentProps): UpdateEnrollmentResponseDTO => {
        return {
            uid: enrollment.uid,
            platformUID: enrollment.platformUID,
            userUID: enrollment.userUID,
            courseUID: enrollment.courseUID,
            enrolledAt: enrollment.enrolledAt,
            completedAt: enrollment.completedAt,
            expiresAt: enrollment.expiresAt,
            status: enrollment.status,
            updatedBy: enrollment.updatedBy,
            updatedAt: enrollment.updatedAt,
        };
    },

    toResponseDTO: (enrollment: EnrollmentProps): EnrollmentResponseDTO => {
        return {
            uid: enrollment.uid,
            platformUID: enrollment.platformUID,
            userUID: enrollment.userUID,
            courseUID: enrollment.courseUID,
            enrolledAt: enrollment.enrolledAt,
            completedAt: enrollment.completedAt,
            expiresAt: enrollment.expiresAt,
            status: enrollment.status,
            createdBy: enrollment.createdBy,
            updatedBy: enrollment.updatedBy,
            createdAt: enrollment.createdAt,
            updatedAt: enrollment.updatedAt,
        };
    },

    toResponseDTOList: (enrollments: EnrollmentProps[]): EnrollmentResponseDTO[] => {
        return enrollments.map(EnrollmentMapper.toResponseDTO);
    },
};
