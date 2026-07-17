import { Person } from "src/person/entities/person.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContentEntity } from "./content.entity";

@Entity()
export class ContentCreditEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    // For cast members
    @Column({
        type: 'text',
    })
    character?: string;

    @ManyToOne(() => Person, (person) => person.contentCredits)
    person: Person;

    @ManyToOne(() => ContentEntity, (content) => content.contentCredits)
    content: ContentEntity;

    // For both cast and crew members
    @Column({
        type: 'text',
    })
    knownForDepartment: string;

}