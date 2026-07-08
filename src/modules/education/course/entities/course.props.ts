import { CourseStatus } from "../enums/course-status.enum";

export interface CourseProps {
    uid: string;
    platformUID: string;
    title: string;
    description: string;
    thumbnail?: string;
    status: CourseStatus;
    createdBy: string;
    updatedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}
