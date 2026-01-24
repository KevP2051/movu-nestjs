import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text'
    })
    fullName: string;

    @Column({
        type: 'text', unique: true
    })
    userName: string;

    @Column({
        type: 'text', unique: true
    })
    email: string;

    @Column({
        type: 'text',
        select: false
    })
    password: string;


}
