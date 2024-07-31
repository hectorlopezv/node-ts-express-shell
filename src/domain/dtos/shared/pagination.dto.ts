export class PaginationDto {
    private constructor(
        public readonly page: number, 
        public readonly limit: number
    ){}


    static create(page: number = 1, limit: number = 10): [string?, PaginationDto?] {
        if(!page){
            return ["page is required", undefined];
        }
        if(typeof page !== "number"){
            return ["page must be a string", undefined];
        }
        if(!limit){
            return ["limit is required", undefined];
        }
        if(typeof limit !== "number"){
            return ["limit must be a boolean", undefined];
        }
        if( isNaN(page) || isNaN(limit)){
            return ["page and limit must be numbers", undefined];
        }
        if(page <=0 || limit <= 0){
            return ["page and limit must be greater than 0", undefined];
        }

        return [undefined, new PaginationDto(page, limit)];
    }
}