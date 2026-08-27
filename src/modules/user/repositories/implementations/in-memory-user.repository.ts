import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindUsersDTO } from "../../dtos/find-users.dto";
import { UserProps } from "../../entities/user.props";
import { Gender } from "../../enum/gender.enum";
import { IUserRepository } from "../user-repository-interface";

export class InMemoryUserRepository implements IUserRepository {
    private users: UserProps[] = [
        {
            uid: "1",
            name: "Matheus",
            email: "matheus@email.com",
            password: "hashed_12345678",
            docNumberBusiness: null,
            docNumberPerson: null,
            gender: Gender.MALE,
            isActivated: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            uid: "2",
            name: "Joan",
            email: "joan@email.com",
            password: "hashed_12345678",
            docNumberBusiness: null,
            docNumberPerson: null,
            gender: Gender.MALE,
            isActivated: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            uid: "3",
            name: "Nara",
            email: "nara@email.com",
            password: "hashed_12345678",
            docNumberBusiness: null,
            docNumberPerson: null,
            gender: Gender.FEMALE,
            isActivated: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    async findByUIDs(
        uids: string[],
        data: FindUsersDTO = {}
    ): Promise<Result<PaginationResult<UserProps>>> {
        let users = this.users.filter((user) => uids.includes(user.uid));

        if (data.name) {
            const name = data.name.toLowerCase();

            users = users.filter((user) => user.name.toLowerCase().includes(name));
        }

        if (data.email) {
            const email = data.email.toLowerCase();

            users = users.filter((user) => user.email.toLowerCase().includes(email));
        }

        if (data.isActivated !== undefined) {
            users = users.filter((user) => user.isActivated === data.isActivated);
        }

        if (data.orderBy) {
            const order = data.order === "desc" ? -1 : 1;

            users.sort((a, b) => {
                const first = a[data.orderBy!];
                const second = b[data.orderBy!];

                if (first === second) {
                    return 0;
                }

                return first! > second! ? order : -order;
            });
        }

        const page = data.page ?? 1;
        const limit = data.limit ?? 10;

        const total = users.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;
        const paginatedUsers = users.slice(start, start + limit);

        return ResultFactory.success({
            data: paginatedUsers,
            page,
            limit,
            total,
            totalPages,
        });
    }

    async findByUID(uid: string): Promise<Result<UserProps | null>> {
        const user = this.users.find((users) => users.uid === uid);

        if (!user) {
            return ResultFactory.success(null);
        }

        return ResultFactory.success(user);
    }

    async findByEmail(email: string): Promise<Result<UserProps | null>> {
        const user = this.users.find((users) => users.email === email);

        if (!user) {
            return ResultFactory.success(null);
        }

        return ResultFactory.success(user);
    }

    async register(user: UserProps): Promise<Result<UserProps>> {
        this.users.push(user);

        return ResultFactory.success(user);
    }
    async update(user: UserProps): Promise<Result<UserProps>> {
        const index = this.users.findIndex((oldUser) => oldUser.uid === user.uid);

        this.users[index] = user;

        return ResultFactory.success(user);
    }
    async delete(uid: string): Promise<Result<boolean>> {
        const index = this.users.findIndex((user) => user.uid === uid);

        if (index === -1) {
            return ResultFactory.success(false);
        }

        this.users.splice(index, 1);

        return ResultFactory.success(true);
    }
}
