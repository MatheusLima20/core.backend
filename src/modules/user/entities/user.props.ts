import { Gender } from "../enum/gender.enum";

export interface UserProps {
    uid: string;
    name: string;
    docNumberPerson: number | null;
    docNumberBusiness: number | null;
    isActivated: boolean;
    gender: Gender;
    email: string;
    password: string;
    createdBy?: string | null;
    updatedBy?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
