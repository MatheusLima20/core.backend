import { Repository } from "typeorm";

import { ContentEntity } from "@/modules/content/entities/content.entity";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindProductsDTO } from "../../dtos/find-products.dto";
import { ProductEntity } from "../../entities/product.entity";
import { ProductWithContent } from "../../types/product-with.content";
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
    ): Promise<Result<PaginationResult<ProductWithContent>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.productRepository
            .createQueryBuilder("product")
            .leftJoin(ContentEntity, "content", "content.uid = product.contentUID")
            .select([
                "product.uid AS product_uid",
                "product.platformUID AS product_platform_uid",
                "product.categoryUID AS product_category_uid",
                "product.contentUID AS product_content_uid",
                "product.name AS product_name",
                "product.description AS product_description",
                "product.price AS product_price",
                "product.barcode AS product_barcode",
                "product.sku AS product_sku",
                "product.active AS product_active",
                "product.createdBy AS product_created_by",
                "product.updatedBy AS product_updated_by",
                "product.createdAt AS product_created_at",
                "product.updatedAt AS product_updated_at",

                "content.url AS content_url",
            ]);

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

        const rows = await query.getRawMany();

        const data: ProductWithContent[] = rows.map((row) => ({
            product: new ProductEntity({
                uid: row.product_uid,
                platformUID: row.product_platform_uid,
                categoryUID: row.product_category_uid,
                contentUID: row.product_content_uid,
                name: row.product_name,
                description: row.product_description,
                price: Number(row.product_price),
                barcode: row.product_barcode,
                sku: row.product_sku,
                active: row.product_active,
                createdBy: row.product_created_by,
                updatedBy: row.product_updated_by,
                createdAt: row.product_created_at,
                updatedAt: row.product_updated_at,
            }),

            content: row.content_url
                ? {
                      url: row.content_url,
                  }
                : null,
        }));

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
