import { Column, Entity, PrimaryGeneratedColumn, TableInheritance, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { GenreEntity } from "../../genres/entities/genre.entity";
import { ContentTypeEnum } from "src/common/enums/content-type.enum";
import { ContentCreditEntity } from "./content-credit";
import { ReviewEntity } from "src/review/entities/review.entity";
import { WishlistEntity } from "src/wishlist/entities/wishlist.entity";
import { FavoriteEntity } from "src/favorite/entities/favorite.entity";

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



    @Column({
        type: 'enum',
        enum: ContentTypeEnum,
        default: ContentTypeEnum.MOVIE
    })
    type: ContentTypeEnum;

    @Column({
        type: 'text',
        nullable: true
    })
    backdropUrl?: string;

    @Column({
        type: 'int',
        default: 0
    })
    reviewsCount: number;

    @Column({
        type: 'float',
        default: 0
    })
    averageRating: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


    @OneToMany(() => ContentCreditEntity, (contentCredit) => contentCredit.content)
    contentCredits: ContentCreditEntity[];

    @OneToMany(() => ReviewEntity, (review) => review.content)
    reviews: ReviewEntity[];


    @OneToMany(() => WishlistEntity, (wishlist) => wishlist.content)
    wishlist: WishlistEntity[];

    @OneToMany(() => FavoriteEntity, (favorite) => favorite.content)
    favorite: FavoriteEntity[];

    @ManyToMany(() => GenreEntity, (genre) => genre.contents)
    @JoinTable()
    genres: GenreEntity[];
}
