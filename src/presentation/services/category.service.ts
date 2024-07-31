import { CategoryModel } from "../../data/mongo/models/category/category.model";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { CategoryEntity } from "../../domain/entities/category/category.entity";
import { UserEntity } from "../../domain/entities/user/user.entity";
import { CustomError } from "../../domain/erros/custom.error";

export class CategoryService {
    constructor(
    ){}

    async getCategories(paginationDto: PaginationDto){
        try {
            const { page, limit } = paginationDto;
            const [total, categories]= await Promise.all([CategoryModel.countDocuments(), CategoryModel.find().skip((page-1)*limit).limit(limit)])
            return {
                categories: categories.map((category)=>{
                    return {
                        id: category.id,
                        name: category.name,
                        available: category.available,
                    }
                }),
                page,
                limit,
                total,
                next: `/api/categories?page=${page+1}&limit=${limit}`,
                prev: page - 1 > 0 ?`/api/categories?page=${page-1}&limit=${limit}`: null,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity): Promise<any> {
        const categoryExists = await CategoryModel.findOne({name: createCategoryDto.name});
        if(categoryExists){
            throw new Error("Category already exists");
        }
        try {
            const category = new CategoryModel({...createCategoryDto, user: user.id});
            await category.save();

            return {
                id: category.id,
                name: category.name,
                available: category.available,
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}