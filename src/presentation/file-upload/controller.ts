import { Request, Response } from "express"
import { CustomError } from "../../domain/erros/custom.error"
import { CreateCategoryDto } from "../../domain/dtos/category/create-category.dto";
import { CategoryService } from "../services/category.service";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { FieldUploadService } from "../services/file-upload.service";
import { UploadedFile } from "express-fileupload";

export class FileUploadController {
    constructor(private readonly fieldUploadService: FieldUploadService){

    }
    private handleError = (error: unknown, res:Response)=>{
    if (error instanceof CustomError){
        return res.status(error.statusCode).json({error: error.message});
    }
    console.log(`Error: ${error}`);
    return res.status(500).json({error: 'Internal Server Error'});
    }

    uploadFile = (req:Request, res: Response)=>{
        const type = req.params.type;
        const file = req.body.files.at(0) as UploadedFile;

        this.fieldUploadService.uploadSingle(file, `uploads/${type}`)
        .then((uploaded)=> res.json({
            fileName: uploaded
        }))
        .catch((error)=> this.handleError(error, res));


    }
    uploadMultipleFiles = (req:Request, res: Response)=>{
        const type = req.params.type;
        const file = req.body.files as UploadedFile[];

        this.fieldUploadService.uploadMultiple(file, `uploads/${type}`)
        .then((uploaded)=> res.json(uploaded))
        .catch((error)=> this.handleError(error, res));
    }
}