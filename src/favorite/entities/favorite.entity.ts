import { ContentEntity } from "src/content/entities/content.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FavoriteEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.favorite)
    users: User;

    @ManyToOne(() => ContentEntity, (content) => content.favorite)
    content: ContentEntity;

}
