import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import { ChargesController } from "../../../controller/ChargesController";
import { UserEntity } from "../../../entity/UserEntity";
import { dataSource } from "../../database/database";
import { AdmLogin } from "../encripty/AdmLogin";

export const Authorization = {
    auth: async (request: Request, response: Response) => {
        const user = request.body as UserEntity;

        try {
            const token = jwt.sign(
                {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        userType: user.fkUserType.name,
                        platform: {
                            id: user.fkPlatform.id,
                            name: user.fkPlatform.name,
                        },
                        plan: user.fkPlatform.fkPlan.name,
                    },
                },
                "secret",
                {
                    expiresIn: "30d",
                }
            );

            const providerName = user.name;

            const nameProviderArray = providerName.split(" ");

            const fistName = nameProviderArray[0];

            const userLogged = {
                name: fistName,
                userType: user.fkUserType.name,
                token,
                platformId: user.fkPlatform.id,
                platformName: user.fkPlatform.name,
                plan: user.fkPlatform.fkPlan.name,
            };

            await ChargesController.generateBilling({
                id: user.id,
                email: user.email,
                name: user.name,
                platform: {
                    id: user.fkPlatform.id,
                    name: user.fkPlatform.name,
                },
                userType: user.fkUserType.name,
            });

            response.json({
                message: "Logado com sucesso!",
                user: userLogged,
            });
        } catch (error) {
            
            response.status(404).json({
                error,
                message: "Não foi possivel validar o login." + error,
            });
        }
    },

    verifyLogin: async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        const userBody = request.body;

        const email = userBody.email;
        const userType = userBody.userType;

        try {
            const userRepository = dataSource.getRepository(UserEntity);

            let user: UserEntity;

            if (userType) {
                user = await userRepository.findOne({
                    where: {
                        email: email,
                        isActive: true,
                        fkUserType: {
                            name: userType,
                        },
                    },
                    relations: [
                        "fkPlatform",
                        "fkUserType",
                        "fkPlatform.fkPlan",
                    ],
                });
            }

            if (!userType) {
                user = await userRepository.findOne({
                    where: { email: email, isActive: true },
                    relations: [
                        "fkPlatform",
                        "fkUserType",
                        "fkPlatform.fkPlan",
                    ],
                });
            }

            if (user === undefined) {
                response
                    .status(404)
                    .send({ message: "Usuário ou senha incorretos!" });
            }

            const password = user.password;

            const isValidPassword = AdmLogin.checkLogin(
                user.email,
                userBody.email,
                userBody.password,
                password
            );
            if (!isValidPassword) {
                response
                    .status(404)
                    .send({ message: "Usuário ou senha incorretos!" });
            }

            request.body = user;

            next();
        } catch (error) {
            response.status(404).send({
                error,
                message: '"Não foi possivel validar o login."',
            });
        }
    },
};
