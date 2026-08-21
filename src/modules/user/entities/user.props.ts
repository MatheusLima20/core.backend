import { Gender } from "../enum/gender.enum";
import { UserType } from "../enum/user-type.enum";

export interface UserProps {
    uid: string;
    name: string;
    docNumberPerson: number | null;
    docNumberBusiness: number | null;
    userType: UserType;
    gender: Gender;
    email: string;
    password: string;
    platformUID: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
