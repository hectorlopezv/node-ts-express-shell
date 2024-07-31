export class CreateCategoryDto {
    private constructor(public readonly name: string, public readonly available: boolean){}


   
    static create(object: {
        [key: string]: any
    }): [string?, CreateCategoryDto?] {
        const { name, available } = object;
        if(!name){
            return ["Name is required", undefined];
        }
        if(typeof name !== "string"){
            return ["Name must be a string", undefined];
        }
        if(!available){
            return ["Available is required", undefined];
        }
        if(typeof available !== "boolean"){
            return ["Available must be a boolean", undefined];
        }
        return [undefined, new CreateCategoryDto(name, available)];
    }
}