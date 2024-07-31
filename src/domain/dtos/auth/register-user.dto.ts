import { regularExps } from "../../../config/regular-exp";

export class RegisterUserDto {
    private constructor(public name: string, public email: string, public password: string){}

    static create(object: {
        [key: string]: any
    }):[string?, RegisterUserDto?]{
        const { name, email, password } = object;
        if(!name){
            return ["Name is required", undefined];
        }
        if(!email){
            return ["Email is required", undefined];
        }
        if(!password){
            return ["Password is required", undefined];
        }
        if(regularExps.email.test(email)){
            return ["Invalid email", undefined];
        }
        return [undefined, new RegisterUserDto(name, email, password)];
    }
}