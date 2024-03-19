import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {CategoryEntity} from "./category.entity";

@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({type: "varchar", nullable: false})
    name: string;

    @Column({type: "varchar", nullable: true})
    description: string | null;

    @ManyToOne(() => CategoryEntity, {eager: true, onDelete: "SET NULL"})
    category: CategoryEntity | null;
}
