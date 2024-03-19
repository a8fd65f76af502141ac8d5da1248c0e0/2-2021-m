import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {CategoryEntity} from "../entities/category.entity";
import {ILike, Repository} from "typeorm";
import {CategoryNotFoundException} from "./category.service";
import {ProductEntity} from "../entities/product.entity";

export class ProductNotFoundException extends Error {
    constructor() {
        super("Product not found");
    }
}

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly repository: Repository<ProductEntity>,
        @InjectRepository(CategoryEntity)
        private readonly catRepository: Repository<CategoryEntity>
    ) {}

    async create(dto: {name: string; description: string | null; categoryId: number | null}): Promise<ProductEntity> {
        if (dto.categoryId != null) {
            const parent = await this.catRepository.findOneBy({id: dto.categoryId});
            if (!parent) throw new CategoryNotFoundException();
        }

        return await this.repository.save({
            name: dto.name,
            description: dto.description ?? null,
            category: dto.categoryId ? {id: dto.categoryId} : null,
        });
    }

    async update(id: number, dto: {name: string | null; description: string | null; categoryId: number | null}): Promise<ProductEntity> {
        const product = await this.repository.findOneBy({id: id});
        if (!product) throw new ProductNotFoundException();

        if (dto.categoryId != null) {
            const parent = await this.catRepository.findOneBy({id: dto.categoryId});
            if (!parent) throw new CategoryNotFoundException();
        }

        product.name = dto.name ?? product.name;
        product.description = dto.description;

        return await this.repository.save({...product, category: {id: dto.categoryId as number}});
    }

    async delete(id: number) {
        const category = await this.repository.findOneBy({id: id});
        if (!category) throw new ProductNotFoundException();

        await this.repository.delete({id: id});
    }

    async findById(id: number): Promise<ProductEntity> {
        const product = await this.repository.findOneBy({id: id});
        if (!product) throw new ProductNotFoundException();

        return product;
    }

    async findByQuery(dto: {query: string}): Promise<ProductEntity[]> {
        const query = `%${dto.query}%`;
        return await this.repository.find({
            relations: ["category"],
            where: [{name: ILike(query)}, {description: ILike(query)}, {category: {name: ILike(query)}}],
        });
    }

    async findAll(): Promise<ProductEntity[]> {
        return await this.repository.find({relations: ["category"]});
    }
}
