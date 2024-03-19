import {Column, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent} from "typeorm";

@Entity()
@Tree("nested-set")
export class CategoryEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({type: "varchar", nullable: false})
    name: string;

    @Column({type: "varchar", nullable: true})
    description: string | null;

    @TreeParent({onDelete: "SET NULL"})
    parent: CategoryEntity | null;

    @TreeChildren()
    subCategories: CategoryEntity[];
}
