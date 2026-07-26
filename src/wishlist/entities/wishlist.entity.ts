import { ContentEntity } from "src/content/entities/content.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WishlistEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.wishlist)
    users: User;

    @ManyToOne(() => ContentEntity, (content) => content.wishlist)
    content: ContentEntity;

}
