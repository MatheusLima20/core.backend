import { randomUUID } from "crypto";
import { IProductRepository } from "../repositories/product-repository.interface";
import { CreateProductDTO } from "../dtos/create-product.dto";
import { ProductEntity } from "../entities/product.entity";
import { UpdateProductDTO } from "../dtos/update-product.dto";
import { SearchProductDTO } from "../dtos/search-product.dto";
import { RequestContext } from "@/shared/context/request-context";

export class ProductUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly productRepository: IProductRepository,
    ) {}

    async create(data: CreateProductDTO) {
        await this.validateProductAlreadyExists(
            data.name,
            this.context.user.platformUID,
        );

        const product = new ProductEntity({
            uid: randomUUID(),
            platformUID: this.context.user.platformUID,
            createdBy: this.context.user.uid,
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
        const product = await this.productRepository.findByUID(
            uid,
            this.context.user.platformUID,
        );

        if (!product) {
            throw new Error("Product not found!");
        }

        return product;
    }

    async findByName(name: string) {
        const product = await this.productRepository.findByName(
            name,
            this.context.user.platformUID,
        );

        if (!product) {
            throw new Error("Product not found!");
        }

        return product;
    }

    async search(filters: SearchProductDTO) {
        const products = await this.productRepository.search({
            ...filters,
            platformUID: this.context.user.platformUID,
        });

        return products;
    }

    async find() {
        const product = await this.productRepository.find(
            this.context.user.platformUID,
        );

        return product;
    }

    async update(data: UpdateProductDTO) {
        const oldProduct = await this.findByUID(data.uid);

        await this.validateProductAlreadyExists(
            data.name,
            oldProduct.platformUID,
            data.uid,
        );

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

    private async validateProductAlreadyExists(
        name: string,
        platformUID: string,
        uid?: string,
    ) {
        const product = await this.productRepository.findByName(
            name,
            platformUID,
        );

        if (product && product.uid !== uid) {
            throw new Error("Product already exists!");
        }
    }
}
