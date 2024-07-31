import { Request, Response } from "express"
import { CustomError } from "../../domain/erros/custom.error"
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { ProductService } from "../services/product.service";
import { CreateProductDto } from "../../domain/dtos/product/create-product.dto";

export class ProductController {
    constructor(private readonly productService: ProductService){

    }
    private handleError = (error: unknown, res:Response)=>{
    if (error instanceof CustomError){
        return res.status(error.statusCode).json({error: error.message});
    }
    console.log(`Error: ${error}`);
    return res.status(500).json({error: 'Internal Server Error'});
    }

    createProduct = (req:Request, res: Response)=>{
        const [error, createProductDto] = CreateProductDto.create({...req.body, user: req.body.user.id});
        if(error){
            return this.handleError(new CustomError(400, error), res);
        }
        this.productService.createProduct(createProductDto!)
        .then((product)=> res.status(201)
        .json(product))
        .catch((error)=> this.handleError(error, res));
    }
    getProducts = (req:Request, res: Response)=>{
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(Number(page), Number(limit));
        if(error){
            return this.handleError(new CustomError(400, error), res);
        }
        this.productService.getProducts(paginationDto!)
        .then((products)=> res.status(200)
        .json(products))
        .catch((error)=> this.handleError(error, res));
    }
}