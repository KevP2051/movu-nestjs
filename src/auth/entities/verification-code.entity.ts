import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VerificationCode {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.verificationCodes, { onDelete: 'CASCADE', eager: false })
    user: User;

    @Column({
        type: 'text'
    })
    email: string;

    @Column({
        type: 'text'
    })
    code: string;

    @Column({
        type: 'timestamp',
    })
    createdAt: Date;

    @Column({
        type: 'timestamp',
    })
    expiresAt: Date;

    @Column({
        type: 'boolean',
        default: false
    })
    used: boolean;
}