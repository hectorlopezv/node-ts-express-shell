import { Router } from 'express';
import {  ProductController } from './controller';
import { AuthMiddleWare } from '../middlewares/auth/auth.middleware';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';


export class ProductRoutes {


static get routes(): Router {

    const router = Router();
    const productService = new ProductService();
    const controller =  new ProductController(productService);
    
    // Definir las rutas
    router.get('/', controller.getProducts );
    router.post('/',[ AuthMiddleWare.validateJWT], controller.createProduct);



    return router;
}


}

