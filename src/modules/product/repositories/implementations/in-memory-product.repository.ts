import { CreateProductResponseDTO } from "../../dtos/create-product.dto";
import { ProductResponseDTO } from "../../dtos/product-response.dto";
import { UpdateProductResponseDTO } from "../../dtos/update-product.dto";
import { ProductEntity } from "../../entities/product.entity";
import { ProductMapper } from "../../mappers/product.mapper";
import { IProductRepository } from "../product-repository.interface";

export class InMemoryProductRepository implements IProductRepository {
    products: ProductEntity[] = [
        {
            uid: "1",
            name: "Table",
            platformUID: "1",
            description: "Why Sale.",
            price: 20,
            amount: 10,
            isForSale: false,
            isOnSale: false,
            createdBy: "1",
            updatedBy: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    async findByName(
        name: string,
        platformUID: string,
    ): Promise<ProductResponseDTO | null> {
        const products = this.products.filter(
            (product) => product.platformUID === platformUID,
        );
        const product = products.find((product) => product.name === name);

        if (!product) {
            return null;
        }

        return product;
    }

    async search(filters: {
        name?: string;
        description?: string;
        platformUID: string;
    }): Promise<ProductResponseDTO[]> {
        const name = filters.name?.toLowerCase();
        const description = filters.description?.toLowerCase();

        let products = this.products.filter(
            (product) => product.platformUID === filters.platformUID,
        );

        if (name) {
            products = products.filter((product) =>
                product.name.toLowerCase().includes(name),
            );
        }

        if (description) {
            products = products.filter((product) =>
                product.description?.toLowerCase().includes(description),
            );
        }

        return ProductMapper.toPlatformUIDResponseList(products);
    }

    async find(platformUID: string): Promise<ProductResponseDTO[]> {
        const products = this.products.filter(
            (product) => product.platformUID === platformUID,
        );

        return ProductMapper.toPlatformUIDResponseList(products);
    }

    async findByUID(uid: string): Promise<ProductResponseDTO | null> {
        return this.products.find((product) => product.uid === uid) || null;
    }

    async register(
        product: ProductEntity,
    ): Promise<CreateProductResponseDTO | null> {
        this.products.push(product);

        return product;
    }

    async update(
        product: ProductEntity,
    ): Promise<UpdateProductResponseDTO | null> {
        const index = this.products.findIndex(
            (oldProduct) => oldProduct.uid === product.uid,
        );

        const updatedProduct = (this.products[index] = product);

        return updatedProduct;
    }

    async delete(uid: string): Promise<boolean> {
        const index = this.products.findIndex(
            (oldProduct) => oldProduct.uid === uid,
        );

        const removedProduct = this.products.splice(index, 1);

        return !!removedProduct;
    }
}
