import {Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, Put} from "@nestjs/common";
import {ProductNotFoundException, ProductService} from "../services/product.service";
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiProperty,
    ApiTags,
} from "@nestjs/swagger";
import {IsInt, IsOptional, IsString, ValidateIf} from "class-validator";
import {Type} from "class-transformer";
import {CategoryNotFoundException} from "../services/category.service";
import {BaseOkResponseDto} from "../../core/common/dto/base-ok-response.dto";

class CreateProductDto {
    @ApiProperty({
        type: String,
        required: true,
        description: "String field",
    })
    @IsString()
    name: string;
    @ApiProperty({
        type: String,
        required: false,
        description: "String field",
    })
    @IsOptional()
    @IsString()
    description: string | undefined;
    @ApiProperty({
        type: "integer",
        nullable: true,
        description: "Integer field",
    })
    @Type(() => Number)
    @ValidateIf((object, value) => value !== null)
    @IsInt()
    categoryId: number | null;
}

class UpdateProductDto {
    @ApiProperty({
        type: String,
        required: false,
        description: "String field",
    })
    @IsString()
    @IsOptional()
    name: string | undefined;
    @ApiProperty({
        type: String,
        required: false,
        description: "String field",
    })
    @IsOptional()
    @IsString()
    description: string | undefined;
    @ApiProperty({
        type: "integer",
        nullable: true,
        description: "Integer field",
    })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    categoryId: number | null | undefined;
}

class ProductIdDto {
    @ApiProperty({
        type: "integer",
        required: true,
        description: "Integer field",
    })
    @Type(() => Number)
    @IsInt()
    id: number;
}

class ProductSearchDto {
    @ApiProperty({
        type: String,
        required: false,
        description: "String field",
    })
    @IsOptional()
    @IsString()
    query: string;
}

class GetProductResponseDto {
    @ApiProperty({required: true, nullable: false, type: Number, description: "API Property"})
    id: number;
    @ApiProperty({required: true, nullable: false, type: String, description: "API Property"})
    name: string;
    @ApiProperty({required: true, nullable: true, type: String, description: "API Property"})
    description: string | null;
    @ApiProperty({required: true, nullable: true, type: Number, description: "API Property"})
    categoryId: number | null;
}

@ApiTags("product")
@Controller("products")
@ApiBadRequestResponse({description: "Invalid request parameters"})
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @ApiOperation({summary: "Summary"})
    @ApiNotFoundResponse({description: "category not found"})
    @ApiCreatedResponse({type: ProductIdDto})
    @Post()
    async create(@Body() dto: CreateProductDto): Promise<ProductIdDto> {
        try {
            const res = await this.productService.create({
                name: dto.name,
                description: dto.description ?? null,
                categoryId: dto.categoryId ?? null,
            });
            return {id: res.id};
        } catch (e) {
            if (e instanceof CategoryNotFoundException) {
                throw new NotFoundException("Parent Category not found");
            }
            throw e;
        }
    }

    @ApiOperation({summary: "Summary"})
    @ApiOkResponse({type: GetProductResponseDto, isArray: true})
    @Get()
    async find(@Query() {query}: ProductSearchDto): Promise<GetProductResponseDto[]> {
        const res = await (query ? this.productService.findByQuery({query}) : this.productService.findAll());
        return res.map((v) => ({id: v.id, name: v.name, description: v.description ?? null, categoryId: v.category?.id ?? null}));
    }

    @ApiOperation({summary: "Summary"})
    @ApiOkResponse({type: GetProductResponseDto, isArray: true})
    @ApiNotFoundResponse({description: "Product not found"})
    @Get(":id")
    async findOne(@Param() {id}: ProductIdDto): Promise<GetProductResponseDto> {
        try {
            const res = await this.productService.findById(id);
            return {
                name: res.name,
                description: res.description ?? null,
                id: res.id,
                categoryId: res.category?.id ?? null,
            };
        } catch (e) {
            if (e instanceof ProductNotFoundException) {
                throw new NotFoundException("Product not found");
            }
            throw e;
        }
    }

    @ApiOperation({summary: "Summary"})
    @ApiOkResponse({type: BaseOkResponseDto, isArray: true})
    @ApiNotFoundResponse({description: "Category not found or product not found"})
    @Put(":id")
    async update(@Param() {id}: ProductIdDto, @Body() dto: UpdateProductDto): Promise<BaseOkResponseDto> {
        try {
            await this.productService.update(id, {
                categoryId: dto.categoryId ?? null,
                name: dto.name ?? null,
                description: dto.description ?? null,
            });
            return {ok: true};
        } catch (e) {
            if (e instanceof CategoryNotFoundException) {
                throw new NotFoundException("Category not found");
            }
            if (e instanceof ProductNotFoundException) {
                throw new NotFoundException("Product not found");
            }
            throw e;
        }
    }

    @ApiOperation({summary: "Summary"})
    @Delete(":id")
    @ApiOkResponse({type: BaseOkResponseDto, isArray: true})
    @ApiNotFoundResponse({description: "Product not found"})
    @ApiConflictResponse({description: "Unable to delete category"})
    async remove(@Param() {id}: ProductIdDto): Promise<BaseOkResponseDto> {
        try {
            await this.productService.delete(id);
            return {ok: true};
        } catch (e) {
            if (e instanceof ProductNotFoundException) {
                throw new NotFoundException("Category not found");
            }
            throw e;
        }
    }
}
