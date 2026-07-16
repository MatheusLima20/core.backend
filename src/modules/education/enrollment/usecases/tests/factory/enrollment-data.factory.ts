import { CreateEnrollmentDTO } from "../../../dtos/create-enrollment.dto";

function nextYear(): Date {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);

    return date;
}

export const dataEnrollment1: CreateEnrollmentDTO = {
    userUID: "user-1",
    courseUID: "course-1",
    expiresAt: nextYear(),
};

export const dataEnrollment2: CreateEnrollmentDTO = {
    userUID: "user-2",
    courseUID: "course-2",
    expiresAt: nextYear(),
};

export function makeEnrollment(data?: Partial<CreateEnrollmentDTO>): CreateEnrollmentDTO {
    return {
        ...dataEnrollment1,
        ...data,
    };
}
