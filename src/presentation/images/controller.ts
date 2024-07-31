import { Request, Response } from "express";
import { CustomError } from "../../domain/erros/custom.error";
import path from "path";
import { existsSync } from "fs";

export class ImageController {
    constructor(){

    }
    private handleError = (error: unknown, res:Response)=>{
    if (error instanceof CustomError){
        return res.status(error.statusCode).json({error: error.message});
    }
    console.log(`Error: ${error}`);
    return res.status(500).json({error: 'Internal Server Error'});
    }

    getImage = (req:Request, res: Response)=>{
        const {type ="", img = ""} = req.params;
        const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${img}`);
        if(!existsSync(imagePath)){
            return res.status(404).json({error: 'Image not found'});
        }

        res.sendFile(imagePath);


    }
}