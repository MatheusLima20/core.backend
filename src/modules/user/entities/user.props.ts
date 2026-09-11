import { Gender } from "../enum/gender.enum";

export interface UserProps {
    uid?: string;
    name: string;
    docNumberPerson: string | null;
    docNumberBusiness: string | null;
    isActivated: boolean;
    gender: Gender;
    email: string;
    password: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
