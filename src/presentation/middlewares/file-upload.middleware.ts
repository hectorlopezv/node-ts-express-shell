import { NextFunction, Request, Response } from "express";

export class FileUploadMiddleWare {
    static containFiles(req: Request, res: Response, next: NextFunction){
        const type = req.params.type;
        const validTypes = ["category", "product", "users"];
        if (!validTypes.includes(type)){
            return res.status(400).json({error: 'Invalid type'});
        }
        const files = req.files;

        if (!files || Object.keys(files).length === 0){
            return res.status(400).json({error: 'No files were uploaded'});
        }
        if(!Array.isArray(files.file)){
            req.body.files = [files.file];
        }else{
            req.body.files = files.file;
        }
        next();
    }
}