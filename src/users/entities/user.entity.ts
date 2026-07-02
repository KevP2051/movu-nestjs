import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { VerificationCode } from "src/auth/entities/verification-code.entity";
import { Exclude } from "class-transformer";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text', unique: true
    })
    userName: string;

    @Column({
        type: 'text', unique: false, nullable: true
    })
    avatarUrl?: string;

    @Column({
        type: 'text', unique: true
    })
    email: string;

    @Column({
        type: 'text',
        select: false
    })
    password: string;

    @Column("text", {
        array: true,
        default: ['user']
    })
    roles: string[];

    @Column({
        type: 'boolean',
        default: true
    })
    isActive: boolean;

    @Exclude()
    @OneToMany(() => VerificationCode, verificationCode => verificationCode.user, {
        cascade: true,
        eager: false
    })
    verificationCodes: VerificationCode[];



    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }


}
