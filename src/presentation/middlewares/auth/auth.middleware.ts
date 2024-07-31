import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../../config/jsonweb.adapter";
import { UserModel } from "../../../data/mongo/models/user/user.model";
import { UserEntity } from "../../../domain/entities/user/user.entity";

export class AuthMiddleWare {

    static async validateJWT(req: Request, res: Response, next: NextFunction) {
        try {
            const authorization = req.header('authorization');
            if(!authorization){
                return res.status(401).json({error: 'Unauthorized'});
            }
            const token = authorization.split(' ')[1];
            if(!token){
                return res.status(401).json({error: 'Unauthorized'});
            }
            const payload = await JwtAdapter.validateToken<{id: string}>(token);
            if(!payload){
                return res.status(401).json({error: 'Invalid token'});
            }
            if(!payload?.id){
                return res.status(401).json({error: 'Invalid token'});
            }
            const user = await UserModel.findById(payload.id);
            if(!user){
                return res.status(401).json({error: 'User not found'});
            }
            req.body.user = UserEntity.fromObject(user);
            next();
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(500).json({error: 'Internal Server Error'});
        }
    }
}