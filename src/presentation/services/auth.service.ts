import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { envs } from "../../config/envs";
import { JwtAdapter } from "../../config/jsonweb.adapter";
import { UserModel } from "../../data/mongo/models/user.model";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/erros/custom.error";
import { EmailService } from "./email.service";

export class AuthService {
    constructor(private readonly emailService: EmailService){}


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
        const token = await JwtAdapter.generateToken({id: user._id || user?.id, email: user.email});
        const {password, ...rest} = UserEntity.fromObject(user);
        this.sendEmailValidationLink(user.email);
        return {
            user: rest,
            token: token
        };
        
       } catch (error) {
        throw CustomError.internalServer(`${error}`);
       }

    }
    public validateEmail = async (token: string)=>{
        const payload =  await JwtAdapter.validateToken(token) as {email: string};
        if(!payload){
            throw CustomError.badRequest("Invalid token");
        }
        if(!payload.email){
            throw CustomError.badRequest("Invalid token");
        }
        const user = await UserModel.findOne({email: payload.email});
        if(!user){
            throw CustomError.badRequest("User not found");
        }
        user.emailValidated = true;
        await user.save();
        const {password, ...rest} = UserEntity.fromObject(user);
        return {
            user: rest
        };

    };
    private async sendEmailValidationLink(email: string){
        const token = await JwtAdapter.generateToken({email});
        if(!token){
            throw CustomError.internalServer("Error generating token");
        }
        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const htmlBody = `
        <h3>Validate your email</h3>
        <p>Click on the following link to validate your email</p>
        <a href="${link}">Validate email</a>
        `;
        const options = {
            to: email,
            subject: "Validate your email",
            htmlBody
        }
        const isSet = await this.emailService.sendEmail(options);
        if(!isSet){
            throw CustomError.internalServer("Error sending email");
        }

        return true;
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
        // send email
        await this.sendEmailValidationLink(user.email);



        return {
            user: rest,
            token
        };

    }
}