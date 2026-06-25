import bcryptjs from "bcryptjs";

export const AdmLogin = {
    hashPassword: (password: string): string => {
        const salt = bcryptjs.genSaltSync();

        const passwordHash = bcryptjs.hashSync(password, salt);

        return passwordHash;
    },

    checkLogin: (
        login: string,
        loginDataBase: string,
        password: string,
        passwordDataBase: string
    ): boolean => {
        const logged = login === loginDataBase && bcryptjs.compareSync(password, passwordDataBase);

        return logged;
    },

    checkPassword: (password: string, passwordDataBase: string): boolean => {
        const logged = bcryptjs.compareSync(password, passwordDataBase);

        return logged;
    },
};
