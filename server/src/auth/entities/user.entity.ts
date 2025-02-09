import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User  {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    fullName: string;

    @Column({ default: false })
    emailVerified: boolean;

    @Column()
    googleId: string;

    @Column()
    verificationToken: string;
}
