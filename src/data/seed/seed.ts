import { MongoDatabase } from "../../config/data/mongo/mongo-database";
import { envs } from "../../config/envs";
import { CategoryModel } from "../mongo/models/category/category.model";
import { ProductModel } from "../mongo/models/product/product.model";
import { UserModel } from "../mongo/models/user/user.model";
import { seedData } from "./data";

(async()=> {
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,

  });

    await main();
    await MongoDatabase.disconnect();
  })();
  
  const randomBetween = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1) + min);
  async function main() {
  
    const users = await UserModel.insertMany(seedData.users);
    const categories = await CategoryModel.insertMany(seedData.categories.map((category)=>{
      return {
        ...category,
        user: users[randomBetween(0, users.length-1)]._id
      };
    }));
    const products = await ProductModel.insertMany(seedData.products.map((product)=>{
      return {
        ...product,
        user: users[randomBetween(0, users.length-1)]._id,
        category: categories[randomBetween(0, categories.length-1)]._id
      };
    }));

  }