import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindEnrollmentsDTO } from "../../dtos/find-enrollments.dto";
import { EnrollmentProps } from "../../entities/enrollment.props";
import { IEnrollmentRepository } from "../enrollment-repository.interface";

export class InMemoryEnrollmentRepository implements IEnrollmentRepository {
    private enrollments: EnrollmentProps[] = [];

    async find(
        platformUID: string,
        filters?: FindEnrollmentsDTO
    ): Promise<Result<EnrollmentProps[], PersistenceError>> {
        let enrollments = this.enrollments.filter(
            (enrollment) => enrollment.platformUID === platformUID
        );

        if (filters?.userUID) {
            enrollments = enrollments.filter(
                (enrollment) => enrollment.userUID === filters.userUID
            );
        }

        if (filters?.courseUID) {
            enrollments = enrollments.filter(
                (enrollment) => enrollment.courseUID === filters.courseUID
            );
        }

        if (filters?.status) {
            enrollments = enrollments.filter((enrollment) => enrollment.status === filters.status);
        }

        if (filters?.orderBy) {
            const { orderBy } = filters;
            const order = filters.order ?? "asc";

            enrollments.sort((a, b) => {
                const left = a[orderBy] ?? "completedAt";
                const right = b[orderBy] ?? "completedAt";

                if (left < right) return order === "asc" ? -1 : 1;
                if (left > right) return order === "asc" ? 1 : -1;

                return 0;
            });
        }

        if (filters?.page && filters?.limit) {
            const start = (filters.page - 1) * filters.limit;
            const end = start + filters.limit;

            enrollments = enrollments.slice(start, end);
        }

        return ResultFactory.success(enrollments);
    }

    async findByUID(platformUID: string, uid: string): Promise<Result<EnrollmentProps | null>> {
        const enrollment =
            this.enrollments.find(
                (enrollment) => enrollment.uid === uid && enrollment.platformUID === platformUID
            ) ?? null;

        return ResultFactory.success(enrollment);
    }

    async create(enrollment: EnrollmentProps): Promise<Result<EnrollmentProps>> {
        this.enrollments.push(enrollment);

        return ResultFactory.success(enrollment);
    }

    async update(enrollment: EnrollmentProps): Promise<Result<EnrollmentProps>> {
        const index = this.enrollments.findIndex(
            (oldEnrollment) => oldEnrollment.uid === enrollment.uid
        );

        this.enrollments[index] = enrollment;

        return ResultFactory.success(enrollment);
    }

    async delete(uid: string): Promise<Result<void>> {
        this.enrollments = this.enrollments.filter((enrollment) => enrollment.uid !== uid);

        return ResultFactory.ok();
    }
}
