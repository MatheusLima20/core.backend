import { CourseStatus } from "../enums/course-status.enum";
import { CourseProps } from "./course.props";

export class CourseEntity implements CourseProps {
    uid!: string;
    platformUID!: string;
    title!: string;
    description!: string;
    thumbnail?: string | undefined;
    status!: CourseStatus;
    createdBy!: string;
    updatedBy!: string | null;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: CourseEntity) {
        Object.assign(this, props);
    }
}
