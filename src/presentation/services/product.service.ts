import { ProductModel } from "../../data/mongo/models/product/product.model";
import { CreateProductDto } from "../../domain/dtos/product/create-product.dto";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { CustomError } from "../../domain/erros/custom.error";

export class ProductService {
    constructor(
    ){}

    async getProducts(paginationDto: PaginationDto){
        try {
            const { page, limit } = paginationDto;
            const [total, products]= await Promise.all([
                ProductModel.countDocuments(), ProductModel.find().skip((page-1)*limit).limit(limit).populate('user', 'name email')])
            return {
                products: products.map((product)=>{
                    return product;
                }),
                page,
                limit,
                total,
                next: `/api/products?page=${page+1}&limit=${limit}`,
                prev: page - 1 > 0 ?`/api/products?page=${page-1}&limit=${limit}`: null,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async createProduct(createProductDto: CreateProductDto): Promise<any> {
        const productExists = await ProductModel.findOne({name: createProductDto.name});
        if(productExists){
            throw new Error("Product already exists");
        }
        try {
            const product = new ProductModel({...createProductDto});
            await product.save();

            return product;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}