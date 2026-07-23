import { Column, Entity, PrimaryGeneratedColumn, TableInheritance, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { GenreEntity } from "../../genres/entities/genre.entity";
import { ContentTypeEnum } from "src/common/enums/content-type.enum";
import { ContentCreditEntity } from "./content-credit";
import { Review } from "src/review/entities/review.entity";

@Entity()
export class ContentEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
        unique: true
    })
    tmdbId: number;

    @Column({
        type: 'text',
        unique: false
    })
    slug: string;


    @Column({
        type: 'text',
    })
    title: string;

    @Column({
        type: 'text',
    })
    overview: string;

    @Column({
        type: 'date',
    })
    releaseDate: Date;

    @Column({
        type: 'text',
    })
    posterPath: string;

    @Column({
        type: 'float',
        nullable: true
    })
    popularity: number;

    @Column({
        type: 'boolean',
        default: false
    })
    adult: boolean;

    @ManyToMany(() => GenreEntity, (genre) => genre.contents)
    @JoinTable()
    genres: GenreEntity[];

    @Column({
        type: 'enum',
        enum: ContentTypeEnum,
        default: ContentTypeEnum.MOVIE
    })
    type: ContentTypeEnum;

    @OneToMany(() => ContentCreditEntity, (contentCredit) => contentCredit.content)
    contentCredits: ContentCreditEntity[];

    @OneToMany(() => Review, (review) => review.content)
    reviews: Review[];
}
