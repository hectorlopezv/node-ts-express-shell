import { Router } from 'express';
import {  FileUploadController } from './controller';
import { FieldUploadService } from '../services/file-upload.service';
import { FileUploadMiddleWare } from '../middlewares/file-upload.middleware';


export class FieldUploadRoutes {


static get routes(): Router {

    const router = Router();
    const fieldUploadService = new FieldUploadService();
    const controller =  new FileUploadController(fieldUploadService);
    
    router.use(FileUploadMiddleWare.containFiles);
    // Definir las rutas
    router.post(`/single/:type`, controller.uploadFile);
    router.post(`/multiple/:type`, controller.uploadMultipleFiles);



    return router;
}


}

