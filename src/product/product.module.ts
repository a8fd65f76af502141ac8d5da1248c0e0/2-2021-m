import {Module} from "@nestjs/common";
import {ProductService} from "./services/product.service";
import {ProductController} from "./web/product.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductEntity} from "./entities/product.entity";
import {CategoryEntity} from "./entities/category.entity";
import {CategoryService} from "./services/category.service";
import {CategoryController} from "./web/category.controller";

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity])],
    controllers: [ProductController, CategoryController],
    providers: [ProductService, CategoryService],
})
export class ProductModule {}
