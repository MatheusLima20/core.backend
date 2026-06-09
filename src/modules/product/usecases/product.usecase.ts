import { randomUUID } from "crypto";
import { IProductRepository } from "../repositories/product-repository.interface";
import { CreateProductDTO } from "../dtos/create-product.dto";
import { ProductEntity } from "../entities/product.entity";
import { UpdateProductDTO } from "../dtos/update-product.dto";
import { SearchProductDTO } from "../dtos/search-product.dto";

export class ProductUsecase {
    constructor(private productRepository: IProductRepository) {}

    async create(data: CreateProductDTO) {
        const product = new ProductEntity({
            uid: randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            updatedBy: null,
            ...data,
        });

        const result = await this.productRepository.register(product);

        if (!result) {
            throw new Error("Product not register!");
        }

        return result;
    }

    async findByUID(uid: string) {
        const product = await this.productRepository.findByUID(uid);

        if (!product) {
            throw new Error("Product not found!");
        }

        return product;
    }

    async findByName(name: string, platformUID: string) {
        const product = await this.productRepository.findByName(
            name,
            platformUID,
        );

        if (!product) {
            throw new Error("Product not found!");
        }

        return product;
    }

    async search(filters: SearchProductDTO) {
        const products = await this.productRepository.search(filters);

        return products;
    }

    async find(platformUID: string) {
        const product = await this.productRepository.find(platformUID);

        return product;
    }

    async update(data: UpdateProductDTO) {
        const oldProduct = await this.findByUID(data.uid);

        const mergedProduct = new ProductEntity({
            ...oldProduct,
            ...data,
            updatedAt: new Date(),
        });

        const product = await this.productRepository.update(mergedProduct);

        if (!product) {
            throw new Error("Product not updated!");
        }

        return product;
    }

    async delete(uid: string) {
        await this.findByUID(uid);

        const isDeleted = await this.productRepository.delete(uid);

        if (!isDeleted) {
            throw new Error("Product not Deleted!");
        }

        return isDeleted;
    }
}
