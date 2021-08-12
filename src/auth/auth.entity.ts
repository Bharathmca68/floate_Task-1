import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    user_name: string;

    @Column()
    password: string;

    // @Column()
    // phone_no: string;

    @Column({ default: true })
    isActive: boolean;
}