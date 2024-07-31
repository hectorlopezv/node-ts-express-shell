import jwt from "jsonwebtoken";
import { envs } from "./envs";
export class JwtAdapter {
    static generateToken(payload: any, duration: string = "2h"){
        return new Promise((resolve, reject)=>{
            jwt.sign(payload, envs.JWT_SECRET, {expiresIn: duration}, (err, token)=>{
                if(err){
                    return resolve(err);
                }

                resolve(token);
            });
        });
    }
    static validateToken(token: string){
        return new Promise((resolve, reject)=>{
            jwt.verify(token, envs.JWT_SECRET, (err, decoded)=>{
                if(err){
                    return resolve(err);
                }

                resolve(decoded);
            });
        });
    }
}