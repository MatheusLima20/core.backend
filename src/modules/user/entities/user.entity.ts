import { Gender } from "../enum/gender.enum";
import { UserType } from "../enum/user-type.enum";
import { UserProps } from "./user.props";

export class UserEntity implements UserProps {
    uid!: string;
    name!: string;
    docNumberPerson!: number | null;
    docNumberBusiness!: number | null;
    userType!: UserType;
    gender!: Gender;
    email!: string;
    password!: string;
    platformUID!: string;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: UserEntity) {
        Object.assign(this, props);
    }
}
