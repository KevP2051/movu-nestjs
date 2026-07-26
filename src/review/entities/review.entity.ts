import { ContentEntity } from "src/content/entities/content.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ReviewEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "text",
        nullable: false,
    })
    title: string;

    @Column({
        type: "text",
        nullable: false,
    })
    description: string;

    @Column({
        type: "int",
        nullable: false,
    })
    rating: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => ContentEntity, (content) => content.reviews, { nullable: false })
    content: ContentEntity;

    @ManyToOne(() => User, (user) => user.reviews, { nullable: false })
    user: User;


}
