import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindCoursesDTO } from "../../dtos/find-courses.dto";
import { CourseProps } from "../../entities/course.props";
import { ICourseRepository } from "../course-repository.interface";

export class InMemoryCourseRepository implements ICourseRepository {
    private courses: CourseProps[] = [];

    async find(
        platformUID: string,
        filters?: FindCoursesDTO
    ): Promise<Result<CourseProps[], PersistenceError>> {
        let courses = this.courses.filter((course) => course.platformUID === platformUID);

        if (filters?.title) {
            const title = filters.title.toLowerCase();

            courses = courses.filter((course) => course.title.toLowerCase().includes(title));
        }

        if (filters?.description) {
            const description = filters.description.toLowerCase();

            courses = courses.filter((course) =>
                course.description.toLowerCase().includes(description)
            );
        }

        if (filters?.status) {
            courses = courses.filter((course) => course.status === filters.status);
        }

        if (filters?.orderBy) {
            const { orderBy } = filters;
            const order = filters.order ?? "asc";

            courses.sort((a, b) => {
                const left = a[orderBy];
                const right = b[orderBy];

                if (left < right) return order === "asc" ? -1 : 1;
                if (left > right) return order === "asc" ? 1 : -1;

                return 0;
            });
        }

        if (filters?.page && filters?.limit) {
            const start = (filters.page - 1) * filters.limit;
            const end = start + filters.limit;

            courses = courses.slice(start, end);
        }

        return ResultFactory.success(courses);
    }

    async findByUID(platformUID: string, uid: string): Promise<Result<CourseProps | null>> {
        const course =
            this.courses.find(
                (course) => course.uid === uid && course.platformUID === platformUID
            ) ?? null;

        return ResultFactory.success(course);
    }

    async create(course: CourseProps): Promise<Result<CourseProps>> {
        this.courses.push(course);

        return ResultFactory.success(course);
    }

    async update(course: CourseProps): Promise<Result<CourseProps>> {
        const index = this.courses.findIndex((oldCourse) => oldCourse.uid === course.uid);

        this.courses[index] = course;

        return ResultFactory.success(course);
    }

    async delete(uid: string): Promise<Result<void>> {
        this.courses = this.courses.filter((course) => course.uid !== uid);

        return ResultFactory.ok();
    }
}
