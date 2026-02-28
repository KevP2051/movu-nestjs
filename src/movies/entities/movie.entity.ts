import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class MovieEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
        unique: true
    })
    tmdbId: number;

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

    // @Column({
    //     type: "array"
    // })

    // genreIds: number[];

    @Column({
        type: 'boolean',
        default: false
    })
    adult: boolean;



    //Reviews
    //Likes 
    //Wishes

}
