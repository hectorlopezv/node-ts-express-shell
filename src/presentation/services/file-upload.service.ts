import { UploadedFile } from "express-fileupload";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { UUIDAdapter } from "../../config/uuid.adapter";
import { CustomError } from "../../domain/erros/custom.error";

export class FieldUploadService {
    constructor(
        private readonly uuid= UUIDAdapter.v4
    ){}
    private checkFolder(folderPath: string){
        if(!existsSync(folderPath)){
            mkdirSync(folderPath);
        }
         
    }
    async uploadSingle(
        file: UploadedFile, 
        folder: string = "uploads", 
        validExtensions: string[] = ["png", "jpg", "jpeg", "gif"]
    ): Promise<any> {
        try {
            const fileExtension = file?.mimetype.split("/").at(1) ?? "";
            if(!validExtensions.includes(fileExtension)){
                throw CustomError.badRequest("Invalid file extension");
            }
            const fileName= `${this.uuid()}.${fileExtension}`;
            const destination = path.resolve(__dirname,"../../../", folder);
            this.checkFolder(destination);
            file?.mv(`${destination}/${fileName}`);
            return fileName;
        } catch (error) {
            throw new Error(`Error uploading file: ${error}`);
        }

    }
   async  uploadMultiple(
        files: UploadedFile[], 
        folder: string = "uploads", 
        validExtensions: string[] = ["png", "jpg", "jpeg", "gif"]
    ): Promise<any> {
        const filesNames = await Promise.all(files.map(async (file)=> this.uploadSingle(file, folder, validExtensions)));
        return filesNames;
    }


}