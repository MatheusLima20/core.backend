import { CreateProductDTO } from "@/modules/gym/product/dtos/create-product.dto";
import { AppError, AppErrorClass } from "@/shared/errors/app.error";
import { expectFailure, expectSuccess } from "@/shared/tests/result.helper";

import { ProductUsecase } from "../../product.usecase";

export async function setupProducts(usecase: ProductUsecase, ...products: CreateProductDTO[]) {
    return Promise.all(products.map((product) => createProductOrFail(usecase, product)));
}

export async function setupProduct(usecase: ProductUsecase, product: CreateProductDTO) {
    return createProductOrFail(usecase, product);
}

async function createProductOrFail(usecase: ProductUsecase, dto: CreateProductDTO) {
    return expectSuccess(await usecase.create(dto));
}

export async function expectCreateProductFailure<E extends AppError>(
    usecase: ProductUsecase,
    dto: CreateProductDTO,
    error: AppErrorClass<E>
): Promise<AppError> {
    return expectFailure(await usecase.create(dto), error);
}
