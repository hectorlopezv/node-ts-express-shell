import { regularExps } from "../../../config/regular-exp";

export class LoginUserDto {
    private constructor(public email: string, public password: string){}

    static create(object: {
        [key: string]: any
    }):[string?, LoginUserDto?]{
        const { email, password } = object;

        if(!email){
            return ["Email is required", undefined];
        }
        if(!password){
            return ["Password is required", undefined];
        }
        if(!regularExps.email.test(email)){
            return ["Invalid email", undefined];
        }
        return [undefined, new LoginUserDto(email, password)];
    }
}