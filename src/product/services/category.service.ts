import {Injectable} from "@nestjs/common";
import {ILike, Repository} from "typeorm";
import {CategoryEntity} from "../entities/category.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductEntity} from "../entities/product.entity";

export class CategoryNotFoundException extends Error {
    constructor() {
        super("Category not found");
    }
}

export class UnableToDeleteCategoryException extends Error {
    constructor() {
        super("Unable to load category");
    }
}

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly repository: Repository<CategoryEntity>,
        @InjectRepository(ProductEntity)
        private readonly prodRepository: Repository<ProductEntity>
    ) {}

    async create(dto: {name: string; description: string | null; parentCategoryId: number | null}): Promise<CategoryEntity> {
        if (dto.parentCategoryId != null) {
            const parent = await this.repository.findOneBy({id: dto.parentCategoryId});
            if (!parent) throw new CategoryNotFoundException();
        }

        return await this.repository.save({
            name: dto.name,
            description: dto.description ?? null,
            subCategories: [],
            parent: dto.parentCategoryId != null ? {id: dto.parentCategoryId} : undefined,
        });
    }

    async update(
        id: number,
        dto: {name: string | null; description: string | null; parentCategoryId: number | null}
    ): Promise<CategoryEntity> {
        const category = await this.repository.findOneBy({id: id});
        if (!category) throw new CategoryNotFoundException();

        if (dto.parentCategoryId != null) {
            const parent = await this.repository.findOneBy({id: dto.parentCategoryId});
            if (!parent) throw new CategoryNotFoundException();
        }

        category.name = dto.name ?? category.name;
        category.description = dto.description;

        return await this.repository.save({...category, parent: {id: dto.parentCategoryId as number}});
    }

    async delete(id: number) {
        const category = await this.repository.findOne({where: {id: id}, relations: ["subCategories"]});
        if (!category) throw new CategoryNotFoundException();

        const children = await category.subCategories;
        if (children.length > 0) throw new UnableToDeleteCategoryException();

        const products = await this.prodRepository.find({
            relations: ["category"],
            where: {
                category: {id: id},
            },
        });
        if (products.length > 0) throw new UnableToDeleteCategoryException();

        await this.repository.delete({id: id});
    }

    async findById(id: number): Promise<CategoryEntity> {
        const category = await this.repository.findOneBy({id: id});
        if (!category) throw new CategoryNotFoundException();

        return category;
    }

    async findByQuery(dto: {query: string}): Promise<CategoryEntity[]> {
        const query = `%${dto.query}%`;
        return await this.repository.find({
            relations: ["subCategories"],
            where: [{name: ILike(query)}, {description: ILike(query)}],
        });
    }

    async findAll(): Promise<CategoryEntity[]> {
        return await this.repository.find({relations: ["subCategories"]});
    }
}
