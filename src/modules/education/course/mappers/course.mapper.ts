import { CourseResponseDTO } from "../dtos/course-response.dto";
import { CreateCourseResponseDTO } from "../dtos/create-course.dto";
import { UpdateCourseResponseDTO } from "../dtos/update-course.dto";
import { CourseProps } from "../entities/course.props";

export const CourseMapper = {
    toCreatedResponseDTO: (course: CourseProps): CreateCourseResponseDTO => {
        return {
            uid: course.uid,
            title: course.title,
            description: course.description,
            platformUID: course.platformUID,
            thumbnail: course.thumbnail,
            status: course.status,
            createdBy: course.createdBy,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
        };
    },

    toUpdatedResponseDTO: (course: CourseProps): UpdateCourseResponseDTO => {
        return {
            uid: course.uid,
            title: course.title,
            thumbnail: course.thumbnail,
            description: course.description,
            platformUID: course.platformUID,
            status: course.status,
            updatedBy: course.updatedBy,
            updatedAt: course.updatedAt,
        };
    },

    toResponseDTO: (course: CourseProps): CourseResponseDTO => {
        return {
            uid: course.uid,
            platformUID: course.platformUID,
            title: course.title,
            thumbnail: course.thumbnail,
            description: course.description,
            status: course.status,
            createdBy: course.createdBy,
            updatedBy: course.updatedBy,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
        };
    },

    toResponseDTOList: (contents: CourseProps[]): CourseResponseDTO[] => {
        return contents.map(CourseMapper.toResponseDTO);
    },
};
