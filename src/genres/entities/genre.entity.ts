import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { ContentEntity } from "../../content/entities/content.entity";

@Entity()
export class GenreEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
        unique: true
    })
    tmdbId: number;

    @Column({
        type: 'enum',
        enum: ['MOVIE', 'SERIES'],
        default: 'MOVIE'
    })
    contentType: string;

    @Column({
        type: 'text',
    })
    name: string;

    @ManyToMany(() => ContentEntity, (content) => content.genres)
    contents: ContentEntity[];

}
