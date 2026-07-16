import { Result } from "@/shared/result";

import { FindEnrollmentsDTO } from "../dtos/find-enrollments.dto";
import { EnrollmentProps } from "../entities/enrollment.props";

export interface IEnrollmentRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<EnrollmentProps | null>>;

    find(platformUID: string, filters?: FindEnrollmentsDTO): Promise<Result<EnrollmentProps[]>>;

    create(enrollment: EnrollmentProps): Promise<Result<EnrollmentProps>>;

    update(enrollment: EnrollmentProps): Promise<Result<EnrollmentProps>>;

    delete(uid: string): Promise<Result<void>>;
}
