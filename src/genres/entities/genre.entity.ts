import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, Index } from "typeorm";
import { ContentEntity } from "../../content/entities/content.entity";

// TMDB reuses genre ids across movies and series (18 is Drama in both lists),
// and the names collide too, so neither tmdbId nor slug is unique on its own.
@Index(['tmdbId', 'contentType'], { unique: true })
@Index(['slug', 'contentType'], { unique: true })
@Entity()
export class GenreEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
    })
    tmdbId: number;

    @Column({
        type: 'enum',
        enum: ['movie', 'series'],
        default: 'movie'
    })
    contentType: string;

    @Column({
        type: 'text',
    })
    name: string;

    @Column({
        type: 'text',
    })
    slug: string;

    @ManyToMany(() => ContentEntity, (content) => content.genres)
    contents: ContentEntity[];

}
