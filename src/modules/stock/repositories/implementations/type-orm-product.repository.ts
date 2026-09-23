import { Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindStocksDTO } from "../../dtos/find-stocks.dto";
import { StockEntity } from "../../entities/stock.entity";
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
    ): Promise<Result<PaginationResult<StockEntity>>> {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const query = this.stockRepository.createQueryBuilder("stock");

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

        const data = await query.getMany();

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
