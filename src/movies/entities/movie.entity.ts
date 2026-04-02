import { Movie } from "src/common/interfaces/movie.interface";
import { ContentEntity } from "src/content/entities/content.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MovieEntity {


    @PrimaryColumn()
    id: number;

    @OneToOne(() => ContentEntity, { cascade: true })
    @JoinColumn({ name: 'id' })
    content: ContentEntity;

    //Reviews
    //Likes 
    //Wishes

}
