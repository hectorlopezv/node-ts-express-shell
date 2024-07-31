import { CustomError } from "../../erros/custom.error";
import { UserEntity } from "../user/user.entity";


export class CategoryEntity {
    constructor(
        public name: string,
        public user: UserEntity,
        public available: boolean,

    ){}

    static fromObject(obj: {
        [key: string]: any
    }): CategoryEntity {
        const { name, user, available} = obj;
        if(!name){
            throw CustomError.badRequest("Category name is required");
        }
        if(!user){
            throw CustomError.badRequest("Category user is required");
        }
        if(!available){
            throw CustomError.badRequest("Category available is required");
        }

        return new CategoryEntity(name, UserEntity.fromObject(user), available);

    }
}