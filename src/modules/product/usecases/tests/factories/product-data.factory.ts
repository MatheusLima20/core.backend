import { CreateProductDTO } from "../../../dtos/create-product.dto";

export const dataProduct1 = (categoryUID: string): CreateProductDTO => ({
    categoryUID,
    name: "Product 1",
    description: "Product description 1",
    price: 100,
    active: true,
    barcode: "12345678",
    sku: "934jdn31",
});

export const dataProduct2 = (categoryUID: string): CreateProductDTO => ({
    categoryUID,
    name: "Product 2",
    description: "Product description 2",
    price: 200,
    active: true,
    barcode: "009877544",
    sku: "38jdue8335",
});

export function makeProduct(
    categoryUID: string,
    data?: Partial<CreateProductDTO>
): CreateProductDTO {
    return {
        ...dataProduct1(categoryUID),
        ...data,
    };
}
