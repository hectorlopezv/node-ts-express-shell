import { Router } from 'express';
import {  CategoryController } from './controller';
import { AuthMiddleWare } from '../middlewares/auth/auth.middleware';
import { CategoryService } from '../services/category.service';


export class CategoryRoutes {


static get routes(): Router {

    const router = Router();
    const categoryService = new CategoryService();
    const controller =  new CategoryController(categoryService);
    
    // Definir las rutas
    router.get('/', controller.getCategories );
    router.post('/',[ AuthMiddleWare.validateJWT], controller.createCategory );



    return router;
}


}

