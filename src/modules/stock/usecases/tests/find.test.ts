import { CategoryUsecase } from "@/modules/category/usecases/category.usecase";
import { dataCategory1 } from "@/modules/category/usecases/tests/factories/category-data.factory";
import { ProductUsecase } from "@/modules/product/usecases/product.usecase";
import {
    dataProduct1,
    dataProduct2,
} from "@/modules/product/usecases/tests/factories/product-data.factory";
import { setupProductCategory } from "@/modules/product/usecases/tests/setup/category-product.setup";
import { AuthUser } from "@/shared/context/auth.user";
import { expectSuccess } from "@/shared/tests/result.helper";

import { StockUsecase } from "../stock.usecase";
import { dataStock1, dataStock2 } from "./factories/stock-data.factory";
import { scenario } from "./setup/stock.builder";
import { setupStock, setupStocks } from "./setup/stock.setup";

describe("StockUsecase - find", () => {
    let usecaseUser1!: StockUsecase;
    let usecaseUser2!: StockUsecase;

    let categoryUsecaseUser1!: CategoryUsecase;
    let productUsecaseUser1!: ProductUsecase;

    let user1!: AuthUser;

    let categoryUID!: string;

    let productUID1!: string;
    let productUID2!: string;
    let productUID3!: string;
    let productUID4!: string;
    let productUID5!: string;

    beforeEach(async () => {
        ({
            usecases: [usecaseUser1, usecaseUser2],
            categoryUsecases: [categoryUsecaseUser1],
            productUsecases: [productUsecaseUser1],
            users: [user1],
        } = (await scenario().loadUsers(["1", "2"])).createUsecases().build());

        const category = await setupProductCategory(categoryUsecaseUser1, dataCategory1);

        categoryUID = category.uid;

        const product1 = expectSuccess(await productUsecaseUser1.create(dataProduct1(categoryUID)));

        const product2 = expectSuccess(await productUsecaseUser1.create(dataProduct2(categoryUID)));

        const product3 = expectSuccess(
            await productUsecaseUser1.create({
                ...dataProduct1(categoryUID),
                name: "Product 3",
            })
        );

        const product4 = expectSuccess(
            await productUsecaseUser1.create({
                ...dataProduct1(categoryUID),
                name: "Product 4",
            })
        );

        const product5 = expectSuccess(
            await productUsecaseUser1.create({
                ...dataProduct1(categoryUID),
                name: "Product 5",
            })
        );

        productUID1 = product1.uid;
        productUID2 = product2.uid;
        productUID3 = product3.uid;
        productUID4 = product4.uid;
        productUID5 = product5.uid;
    });

    test("Should find all platform stocks", async () => {
        await setupStocks(usecaseUser1, dataStock1(productUID1), dataStock2(productUID2));

        const stocks = expectSuccess(await usecaseUser1.find());

        expect(stocks.data).toHaveLength(2);

        expect(stocks.data.every((item) => item.platformUID === user1.platformUID)).toBe(true);
    });

    test("Should return stocks with product data", async () => {
        const stock = await setupStock(usecaseUser1, dataStock1(productUID1));

        const stocks = expectSuccess(await usecaseUser1.find());

        expect(stocks.data).toHaveLength(1);

        expect(stocks.data[0]).toMatchObject({
            uid: stock.uid,
            platformUID: user1.platformUID,
            productUID: productUID1,
            quantity: 100,
            minimumStock: 20,
            product: {
                name: "Product 1",
                description: dataProduct1(categoryUID).description ?? null,
                price: dataProduct1(categoryUID).price,
            },
        });
    });

    test("Should return empty list when platform has no stocks", async () => {
        const stocks = expectSuccess(await usecaseUser2.find());

        expect(stocks.data).toEqual([]);
    });

    test("Should filter stocks by product", async () => {
        const stock1 = await setupStock(usecaseUser1, dataStock1(productUID1));

        await setupStock(usecaseUser1, dataStock2(productUID2));

        const stocks = expectSuccess(
            await usecaseUser1.find({
                productUID: productUID1,
            })
        );

        expect(stocks.data).toHaveLength(1);
        expect(stocks.data[0].uid).toBe(stock1.uid);
        expect(stocks.data[0].productUID).toBe(productUID1);
    });

    test("Should return empty when filters match nothing", async () => {
        await setupStock(usecaseUser1, dataStock1(productUID1));

        const stocks = expectSuccess(
            await usecaseUser1.find({
                productUID: "invalid-product",
            })
        );

        expect(stocks.data).toEqual([]);
    });

    test("Should order stocks by quantity ascending", async () => {
        const stockB = await setupStock(usecaseUser1, {
            ...dataStock1(productUID1),
            quantity: 200,
        });

        const stockA = await setupStock(usecaseUser1, {
            ...dataStock2(productUID2),
            quantity: 100,
        });

        const stocks = expectSuccess(
            await usecaseUser1.find({
                orderBy: "quantity",
                order: "asc",
            })
        );

        expect(stocks.data.map((item) => item.uid)).toEqual([stockA.uid, stockB.uid]);
    });

    test("Should order stocks by quantity descending", async () => {
        const stockB = await setupStock(usecaseUser1, {
            ...dataStock1(productUID1),
            quantity: 200,
        });

        const stockA = await setupStock(usecaseUser1, {
            ...dataStock2(productUID2),
            quantity: 100,
        });

        const stocks = expectSuccess(
            await usecaseUser1.find({
                orderBy: "quantity",
                order: "desc",
            })
        );

        expect(stocks.data.map((item) => item.uid)).toEqual([stockB.uid, stockA.uid]);
    });

    test("Should order stocks by minimum stock ascending", async () => {
        const stockB = await setupStock(usecaseUser1, {
            ...dataStock1(productUID1),
            minimumStock: 30,
        });

        const stockA = await setupStock(usecaseUser1, {
            ...dataStock2(productUID2),
            minimumStock: 10,
        });

        const stocks = expectSuccess(
            await usecaseUser1.find({
                orderBy: "minimumStock",
                order: "asc",
            })
        );

        expect(stocks.data.map((item) => item.uid)).toEqual([stockA.uid, stockB.uid]);
    });

    test("Should return first page", async () => {
        const [stockA, stockB] = await setupStocks(
            usecaseUser1,
            dataStock1(productUID1),
            dataStock2(productUID2)
        );

        await setupStocks(
            usecaseUser1,
            {
                ...dataStock1(productUID3),
                quantity: 300,
            },
            {
                ...dataStock2(productUID4),
                quantity: 400,
            }
        );

        const stocks = expectSuccess(
            await usecaseUser1.find({
                page: 1,
                limit: 2,
            })
        );

        expect(stocks.data).toHaveLength(2);

        expect(stocks.data.map((item) => item.uid)).toEqual([stockA.uid, stockB.uid]);
    });

    test("Should return second page", async () => {
        await setupStocks(usecaseUser1, dataStock1(productUID1), dataStock2(productUID2));

        const [stockC, stockD] = await setupStocks(
            usecaseUser1,
            {
                ...dataStock1(productUID3),
                quantity: 300,
            },
            {
                ...dataStock2(productUID4),
                quantity: 400,
            }
        );

        const stocks = expectSuccess(
            await usecaseUser1.find({
                page: 2,
                limit: 2,
            })
        );

        expect(stocks.data.map((item) => item.uid)).toEqual([stockC.uid, stockD.uid]);
    });

    test("Should return remaining stocks on last page", async () => {
        await setupStocks(
            usecaseUser1,
            dataStock1(productUID1),
            dataStock2(productUID2),
            {
                ...dataStock1(productUID3),
                quantity: 300,
            },
            {
                ...dataStock2(productUID4),
                quantity: 400,
            }
        );

        const [stockE] = await setupStocks(usecaseUser1, {
            ...dataStock1(productUID5),
            quantity: 500,
        });

        const stocks = expectSuccess(
            await usecaseUser1.find({
                page: 3,
                limit: 2,
            })
        );

        expect(stocks.data.map((item) => item.uid)).toEqual([stockE.uid]);
    });

    test("Should return empty list when page does not exist", async () => {
        await setupStocks(usecaseUser1, dataStock1(productUID1), dataStock2(productUID2));

        const stocks = expectSuccess(
            await usecaseUser1.find({
                page: 10,
                limit: 10,
            })
        );

        expect(stocks.data).toEqual([]);
    });

    test("Should filter, order and paginate stocks", async () => {
        const stockA = await setupStock(usecaseUser1, {
            productUID: productUID1,
            quantity: 100,
            minimumStock: 30,
        });

        const stockB = await setupStock(usecaseUser1, {
            productUID: productUID2,
            quantity: 200,
            minimumStock: 20,
        });

        await setupStock(usecaseUser1, {
            productUID: productUID3,
            quantity: 300,
            minimumStock: 10,
        });

        const stocks = expectSuccess(
            await usecaseUser1.find({
                orderBy: "quantity",
                order: "asc",
                page: 1,
                limit: 2,
            })
        );

        expect(stocks.data.map((item) => item.uid)).toEqual([stockA.uid, stockB.uid]);

        expect(stocks.total).toBe(3);
        expect(stocks.totalPages).toBe(2);
    });

    test("Should order before paginate", async () => {
        await setupStock(usecaseUser1, {
            productUID: productUID1,
            quantity: 100,
            minimumStock: 10,
        });

        await setupStock(usecaseUser1, {
            productUID: productUID2,
            quantity: 200,
            minimumStock: 20,
        });

        const stockC = await setupStock(usecaseUser1, {
            productUID: productUID3,
            quantity: 300,
            minimumStock: 30,
        });

        const stockD = await setupStock(usecaseUser1, {
            productUID: productUID4,
            quantity: 400,
            minimumStock: 40,
        });

        const stocks = expectSuccess(
            await usecaseUser1.find({
                orderBy: "quantity",
                order: "asc",
                page: 2,
                limit: 2,
            })
        );

        expect(stocks.data.map((item) => item.uid)).toEqual([stockC.uid, stockD.uid]);
    });
});
