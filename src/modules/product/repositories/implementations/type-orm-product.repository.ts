import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindProductsDTO } from "../../dtos/find-products.dto";
import { ProductEntity } from "../../entities/product.entity";
import { IProductRepository } from "../product-repository.interface";

export class TypeORMProductRepository implements IProductRepository {
    constructor(private readonly productRepository: Repository<ProductEntity>) {}

    async findByUID(uid: string, platformUID?: string): Promise<Result<ProductEntity | null>> {
        const query = this.productRepository
            .createQueryBuilder("product")
            .where("product.uid = :uid", {
                uid,
            });

        if (platformUID) {
            query.andWhere("product.platformUID = :platformUID", {
                platformUID,
            });
        }

        const product = await query.getOne();

        return ResultFactory.success(product);
    }

    async find(
        filters?: FindProductsDTO,
        platformUID?: string
    ): Promise<Result<PaginationResult<ProductEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.productRepository.createQueryBuilder("product");

        if (platformUID) {
            query.andWhere("product.platformUID = :platformUID", {
                platformUID,
            });
        }

        if (filters?.categoryUID) {
            query.andWhere("product.categoryUID = :categoryUID", {
                categoryUID: filters.categoryUID,
            });
        }

        if (filters?.name) {
            query.andWhere("product.name ILIKE :name", {
                name: `%${filters.name}%`,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `product.${filters.orderBy}`,
                filters.order?.toUpperCase() === "DESC" ? "DESC" : "ASC"
            );
        }

        const total = await query.getCount();

        query.skip((page - 1) * limit).take(limit);

        const data = await query.getMany();

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    }

    async register(product: ProductEntity): Promise<Result<ProductEntity>> {
        const savedProduct = await this.productRepository.save(product);

        return ResultFactory.success(savedProduct);
    }

    async update(product: ProductEntity): Promise<Result<ProductEntity>> {
        const savedProduct = await this.productRepository.save(product);

        return ResultFactory.success(savedProduct);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.productRepository.delete(uid);

        return ResultFactory.ok();
    }
}
