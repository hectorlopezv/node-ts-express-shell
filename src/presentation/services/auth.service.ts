import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { JwtAdapter } from "../../config/jsonweb.adapter";
import { UserModel } from "../../data/mongo/models/user.model";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/erros/custom.error";

export class AuthService {
    constructor(){}


    public async registerUser(registerUserDto: RegisterUserDto){
        const existsUser = await UserModel.findOne({email: registerUserDto.email});
        if(existsUser){
            throw CustomError.badRequest("Email already exists");
        }

       try {
        const user = new UserModel(registerUserDto);
        user.password = bcryptAdapter.hash(registerUserDto.password);
        await user.save();
        //encrypt password
        // jwt  to authenticate user
        // email de confirmacion
        const {password, ...rest} = UserEntity.fromObject(user);
        return {
            user: rest,
            token: "token"
        };
        
       } catch (error) {
        throw CustomError.internalServer(`${error}`);
       }

    }

    public async loginUser(loginUserDto: LoginUserDto){
        const user = await UserModel.findOne({email: loginUserDto.email});
        if(!user){
            throw CustomError.badRequest("User not found");
        }
        if(!bcryptAdapter.compare(loginUserDto.password, user.password)){
            throw CustomError.badRequest("Invalid password");
        }
        const {password, ...rest} = UserEntity.fromObject(user);
        const token = await JwtAdapter.generateToken({id: user?._id || user?.id, email: user.email});
        if(!token){
            throw CustomError.internalServer("Error generating token");
        }

        return {
            user: rest,
            token
        };

    }
}