import { Result } from "@/shared/result";
import { IProductRepository } from "../product-repository.interface";
import { ProductProps } from "../../entities/product.props";
import { ResultFactory } from "@/shared/result/result.factory";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { FindProductsDTO } from "../../dtos/find-products.dto";

export class InMemoryProductRepository implements IProductRepository {
    products: ProductProps[] = [];

    async find(
        platformUID: string,
        filters?: FindProductsDTO,
    ): Promise<Result<ProductProps[], PersistenceError>> {
        let products = this.products.filter(
            (product) => product.platformUID === platformUID,
        );

        if (filters?.name) {
            const name = filters.name.toLowerCase();

            products = products.filter((product) =>
                product.name.toLowerCase().includes(name),
            );
        }

        if (filters?.description) {
            const description = filters.description.toLowerCase();

            products = products.filter((product) =>
                product.description.toLowerCase().includes(description),
            );
        }

        if (filters?.orderBy) {
            const orderBy = filters.orderBy;
            const order = filters.order ?? "asc";

            products.sort((a, b) => {
                const left = a[orderBy];
                const right = b[orderBy];

                if (left < right) return order === "asc" ? -1 : 1;
                if (left > right) return order === "asc" ? 1 : -1;

                return 0;
            });
        }

        if (filters?.page && filters?.limit) {
            const start = (filters.page - 1) * filters.limit;
            const end = start + filters.limit;

            products = products.slice(start, end);
        }

        return ResultFactory.success(products);
    }

    async findByUID(
        uid: string,
        platformUID: string,
    ): Promise<Result<ProductProps | null>> {
        const products = this.products.filter(
            (product) => product.platformUID === platformUID,
        );
        const product = products.find((product) => product.uid === uid);

        return ResultFactory.success(product ?? null);
    }

    async register(product: ProductProps): Promise<Result<ProductProps>> {
        this.products.push(product);

        return ResultFactory.success(product);
    }

    async update(product: ProductProps): Promise<Result<ProductProps>> {
        const index = this.products.findIndex(
            (oldProduct) => oldProduct.uid === product.uid,
        );

        this.products[index] = product;

        return ResultFactory.success(product);
    }

    async delete(uid: string): Promise<Result<void>> {
        const newProducts = this.products.filter(
            (oldProduct) => oldProduct.uid !== uid
        );

        this.products = newProducts;

        return ResultFactory.ok();
    }
}
