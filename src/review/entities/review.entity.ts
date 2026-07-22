import { ContentEntity } from "src/content/entities/content.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Review {

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

    @ManyToOne(() => ContentEntity, (content) => content.reviews, { nullable: false })
    content: ContentEntity;

    @ManyToOne(() => User, (user) => user.reviews, { nullable: false })
    user: User;

}
