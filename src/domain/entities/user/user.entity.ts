import { CustomError } from "../../erros/custom.error";


export class UserEntity {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public password: string,
        public emailValidated: boolean,
        public role: string[],
        public img?: string
    ){}

    static fromObject(obj: {
        [key: string]: any
    }): UserEntity {
        const { id, _id, name, email, password, emailValidated, role, img } = obj;
        if(!_id && !id){
            throw CustomError.badRequest("User id is required");
        }
        if(!name){
            throw CustomError.badRequest("User name is required");
        }
        if(!email){
            throw CustomError.badRequest("User email is required");
        }
        if(!password){
            throw CustomError.badRequest("User password is required");
        }
        if(!role){
            throw CustomError.badRequest("User role is required");
        }

        return new UserEntity(_id|| id, name, email, password, emailValidated, role, img);
    }
}