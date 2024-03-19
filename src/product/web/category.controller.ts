import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    NotFoundException,
    Query,
    ConflictException,
    Put
} from "@nestjs/common";
import {IsInt, IsOptional, IsString, ValidateIf} from "class-validator";
import {Type} from "class-transformer";
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
import {CategoryNotFoundException, CategoryService, UnableToDeleteCategoryException} from "../services/category.service";
import {BaseOkResponseDto} from "../../core/common/dto/base-ok-response.dto";

class CreateCategoryDto {
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
    parentId: number | null;
}

class UpdateCategoryDto {
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
    parentId: number | null | undefined;
}

class CategoryIdDto {
    @ApiProperty({
        type: "integer",
        required: true,
        description: "Integer field",
    })
    @Type(() => Number)
    @IsInt()
    id: number;
}

class CategorySearchDto {
    @ApiProperty({
        type: String,
        required: false,
        description: "String field",
    })
    @IsOptional()
    @IsString()
    query: string;
}

class GetCategoryResponseDto {
    @ApiProperty({required: true, nullable: false, type: Number, description: "API Property"})
    id: number;
    @ApiProperty({required: true, nullable: false, type: String, description: "API Property"})
    name: string;
    @ApiProperty({required: true, nullable: true, type: String, description: "API Property"})
    description: string | null;
}

class GetCategoriesResponseDto {
    @ApiProperty({required: true, nullable: false, type: Number, description: "API Property"})
    id: number;
    @ApiProperty({required: true, nullable: false, type: String, description: "API Property"})
    name: string;
    @ApiProperty({required: true, nullable: true, type: String, description: "API Property"})
    description: string | null;
    @ApiProperty({required: true, nullable: false, type: GetCategoryResponseDto, isArray: true, description: "API Property"})
    subCategories: Omit<GetCategoriesResponseDto, "subCategories">[];
}

@ApiTags("category")
@Controller("categories")
@ApiBadRequestResponse({description: "Invalid request parameters"})
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @ApiOperation({summary: "Summary"})
    @ApiNotFoundResponse({description: "Parent category not found"})
    @ApiCreatedResponse({type: CategoryIdDto})
    @Post()
    async create(@Body() dto: CreateCategoryDto): Promise<CategoryIdDto> {
        try {
            const res = await this.categoryService.create({
                name: dto.name,
                description: dto.description ?? null,
                parentCategoryId: dto.parentId ?? null,
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
    @ApiOkResponse({type: GetCategoriesResponseDto, isArray: true})
    @Get()
    async find(@Query() {query}: CategorySearchDto): Promise<GetCategoriesResponseDto[]> {
        const res = await (query ? this.categoryService.findByQuery({query}) : this.categoryService.findAll());
        return res.map((v) => ({
            id: v.id,
            name: v.name,
            description: v.description ?? null,
            subCategories: v.subCategories.map((vv) => ({id: vv.id, name: vv.name, description: vv.description ?? null})),
        }));
    }

    @ApiOperation({summary: "Summary"})
    @ApiOkResponse({type: GetCategoryResponseDto, isArray: true})
    @ApiNotFoundResponse({description: "Category not found"})
    @Get(":id")
    async findOne(@Param() {id}: CategoryIdDto): Promise<GetCategoryResponseDto> {
        try {
            const res = await this.categoryService.findById(id);
            return {
                name: res.name,
                description: res.description ?? null,
                id: res.id,
            };
        } catch (e) {
            if (e instanceof CategoryNotFoundException) {
                throw new NotFoundException("Category not found");
            }
            throw e;
        }
    }

    @ApiOperation({summary: "Summary"})
    @ApiOkResponse({type: BaseOkResponseDto, isArray: true})
    @ApiNotFoundResponse({description: "Category not found"})
    @Put(":id")
    async update(@Param() {id}: CategoryIdDto, @Body() dto: UpdateCategoryDto): Promise<BaseOkResponseDto> {
        try {
            await this.categoryService.update(id, {
                parentCategoryId: dto.parentId ?? null,
                name: dto.name ?? null,
                description: dto.description ?? null,
            });
            return {ok: true};
        } catch (e) {
            if (e instanceof CategoryNotFoundException) {
                throw new NotFoundException("Category not found");
            }
            throw e;
        }
    }

    @ApiOperation({summary: "Summary"})
    @Delete(":id")
    @ApiOkResponse({type: BaseOkResponseDto, isArray: true})
    @ApiNotFoundResponse({description: "Category not found"})
    @ApiConflictResponse({description: "Unable to delete category"})
    async remove(@Param() {id}: CategoryIdDto): Promise<BaseOkResponseDto> {
        try {
            await this.categoryService.delete(id);
            return {ok: true};
        } catch (e) {
            if (e instanceof CategoryNotFoundException) {
                throw new NotFoundException("Category not found");
            }
            if (e instanceof UnableToDeleteCategoryException) {
                throw new ConflictException("Unable to delete category");
            }
            throw e;
        }
    }
}
