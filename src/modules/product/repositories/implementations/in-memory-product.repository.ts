import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindProductsDTO } from "../../dtos/find-products.dto";
import { ProductEntity } from "../../entities/product.entity";
import { IProductRepository } from "../product-repository.interface";

export class InMemoryProductRepository implements IProductRepository {
    private products: ProductEntity[] = [];

    async findByUID(uid: string, platformUID: string): Promise<Result<ProductEntity | null>> {
        const product =
            this.products.find(
                (product) => product.platformUID === platformUID && product.uid === uid
            ) ?? null;

        return ResultFactory.success(product);
    }

    async find(
        filters?: FindProductsDTO,
        platformUID?: string
    ): Promise<Result<PaginationResult<ProductEntity>>> {
        let products = this.products;

        if (platformUID) {
            products = products.filter((product) => product.platformUID === platformUID);
        }

        if (filters?.categoryUID) {
            products = products.filter((product) => product.categoryUID === filters.categoryUID);
        }

        if (filters?.name) {
            products = products.filter((product) =>
                product.name.toLowerCase().includes(filters.name!.toLowerCase())
            );
        }

        if (filters?.orderBy) {
            products.sort((a, b) => {
                const valueA = a[filters.orderBy!] ?? "";
                const valueB = b[filters.orderBy!] ?? "";

                if (valueA < valueB) {
                    return filters.order === "desc" ? 1 : -1;
                }

                if (valueA > valueB) {
                    return filters.order === "desc" ? -1 : 1;
                }

                return 0;
            });
        }

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const total = products.length;
        const totalPages = Math.ceil(total / limit);

        const start = (page - 1) * limit;

        const data = products.slice(start, start + limit);

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
        });
    }

    async register(product: ProductEntity): Promise<Result<ProductEntity>> {
        this.products.push(product);

        return ResultFactory.success(product);
    }

    async update(product: ProductEntity): Promise<Result<ProductEntity>> {
        const index = this.products.findIndex((item) => item.uid === product.uid);

        this.products[index] = product;

        return ResultFactory.success(product);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.products.findIndex((product) => product.uid === uid);

        if (index !== -1) {
            this.products.splice(index, 1);
        }

        return ResultFactory.success(undefined);
    }
}
