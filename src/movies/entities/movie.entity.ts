import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Movie {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text'
    })
    tmdbId: string;

    //Reviews
    //Likes 
    //Wishes

}
