import { Person } from "src/person/entities/person.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ContentCreditEntity {

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
    character: string;

    @ManyToOne(() => Person, (person) => person.contentCredits)
    person: Person;

}