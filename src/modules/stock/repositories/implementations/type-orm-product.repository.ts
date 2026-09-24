import { Repository } from "typeorm";

import { ContentEntity } from "@/modules/content/entities/content.entity";
import { ProductEntity } from "@/modules/product/entities/product.entity";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindStocksDTO } from "../../dtos/find-stocks.dto";
import { StockEntity } from "../../entities/stock.entity";
import { StockWithProduct } from "../../types/stock-with-product";
import { IStockRepository } from "../stock-repository.interface";

export class TypeORMStockRepository implements IStockRepository {
    constructor(private readonly stockRepository: Repository<StockEntity>) {}

    async findByUID(uid: string, platformUID?: string): Promise<Result<StockEntity | null>> {
        const query = this.stockRepository.createQueryBuilder("stock").where("stock.uid = :uid", {
            uid,
        });

        if (platformUID) {
            query.andWhere("stock.platformUID = :platformUID", {
                platformUID,
            });
        }

        const stock = await query.getOne();

        return ResultFactory.success(stock);
    }

    async find(
        filters?: FindStocksDTO,
        platformUID?: string
    ): Promise<Result<PaginationResult<StockWithProduct>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.stockRepository
            .createQueryBuilder("stock")
            .innerJoin(
                ProductEntity,
                "product",
                "product.uid = stock.productUID AND product.platformUID = stock.platformUID"
            )
            .leftJoin(ContentEntity, "content", "content.uid = product.contentUID")
            .select([
                "stock.uid AS stock_uid",
                "stock.platformUID AS stock_platform_uid",
                "stock.productUID AS stock_product_uid",
                "stock.quantity AS stock_quantity",
                "stock.minimumStock AS stock_minimum_stock",
                "stock.createdBy AS stock_created_by",
                "stock.updatedBy AS stock_updated_by",
                "stock.createdAt AS stock_created_at",
                "stock.updatedAt AS stock_updated_at",

                "product.uid AS product_uid",
                "product.name AS product_name",
                "product.description AS product_description",
                "product.price AS product_price",

                "content.uid AS content_uid",
                "content.url AS content_url",
            ]);

        if (platformUID) {
            query.andWhere("stock.platformUID = :platformUID", {
                platformUID,
            });
        }

        if (filters?.productUID) {
            query.andWhere("stock.productUID = :productUID", {
                productUID: filters.productUID,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `stock.${filters.orderBy}`,
                filters.order?.toUpperCase() === "DESC" ? "DESC" : "ASC"
            );
        }

        const total = await query.getCount();

        query.skip((page - 1) * limit).take(limit);

        const rows = await query.getRawMany();

        const data: StockWithProduct[] = rows.map((row) => ({
            stock: new StockEntity({
                uid: row.stock_uid,
                platformUID: row.stock_platform_uid,
                productUID: row.stock_product_uid,
                quantity: Number(row.stock_quantity),
                minimumStock: Number(row.stock_minimum_stock),
                createdBy: row.stock_created_by,
                updatedBy: row.stock_updated_by,
                createdAt: row.stock_created_at,
                updatedAt: row.stock_updated_at,
            }),

            product: {
                name: row.product_name,
                description: row.product_description,
                price: Number(row.product_price),

                content: row.content_uid
                    ? {
                          url: row.content_url,
                      }
                    : null,
            },
        }));

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    }

    async register(stock: StockEntity): Promise<Result<StockEntity>> {
        const savedStock = await this.stockRepository.save(stock);

        return ResultFactory.success(savedStock);
    }

    async update(stock: StockEntity): Promise<Result<StockEntity>> {
        const savedStock = await this.stockRepository.save(stock);

        return ResultFactory.success(savedStock);
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.stockRepository.delete(uid);

        return ResultFactory.ok();
    }
}
