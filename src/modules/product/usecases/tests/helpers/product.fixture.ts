import { CreateProductDTO } from "@/modules/product/dtos/create-product.dto";
import { ProductUsecase } from "../../product.usecase";
import { expectSuccess } from "@/shared/tests/result.helper";

async function setupProducts(
    usecase: ProductUsecase,
    ...products: CreateProductDTO[]
) {
    return Promise.all(
        products.map((product) => createProductOrFail(usecase, product)),
    );
}

async function createProductOrFail(usecase: ProductUsecase, dto: CreateProductDTO) {
    return expectSuccess(await usecase.create(dto));
}
