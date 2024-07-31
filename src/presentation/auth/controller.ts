import { Request, Response } from "express"
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto"
import { AuthService } from "../services/auth.service";
import { CustomError } from "../../domain/erros/custom.error";

export class AuthController {
    constructor(public readonly authService: AuthService){

    }
    private handleError(error: any, res:Response){
        if( error instanceof CustomError){
            res.status(error.statusCode).json({error: error.message});
        }
        console.log(`Error: ${error}`);
        return res.status(500).json({error: 'Internal Server Error'});
    }

    register = (req:Request, res: Response)=>{
        const [error, registerDto] = RegisterUserDto.create(req.body);
        if(error){
            return res.status(400).json({error});
        }
        this.authService.registerUser(registerDto!)
        .then((user)=>res.json(user))
        .catch((error)=> this.handleError(error, res));
    }
    login = (req:Request, res: Response)=>{
        res.json({message: 'login'})
    }
    validateEmail = (req:Request, res: Response)=>{
        const token = req.params.token;

        this.authService.validateEmail(token)
        .then((user)=>res.json(user))
        .catch((error)=> this.handleError(error, res));

        res.json({message: 'validateEmail'})
    }
}