import { Validators } from "../../../config/validators";

export class CreateProductDto {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string,  // ID      
        public readonly category: string, // ID
    ){
    }

   static create(obj:{
    [key:string]: any
   }):[string?, CreateProductDto?]{
    const { name, available, price, category,description, user } = obj;
    if(!name){
        return ['Product name is required', undefined];

    }
    if(!price){
        return ['Product price is required', undefined];
    }
    if(typeof price !== 'number'){
        return ['Product price must be a number', undefined];
    }
    if(!available){
        return ['Product available is required', undefined];
    }
    if(typeof available !== 'boolean'){
        return ['Product available must be a boolean', undefined];
    }
    if(!description){
        return ['Product description is required', undefined];
    }
    if(typeof description !== 'string'){
        return ['Product description must be a string', undefined];
    }

    if(!category){
        return ['Product category is required', undefined];
    }
    if(!Validators.isMongoId(category)){
        return ['Product category is invalid', undefined];
    }

    if(!user){
        return ['Product user is required', undefined];
    }
    if(!Validators.isMongoId(user)){
        return ['Product user is invalid', undefined];
    }

    return [undefined, new CreateProductDto(name, !!available, price, description, user, category)];
    
    }
}