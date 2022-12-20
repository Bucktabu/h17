import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() login: string;

  @Column() email: string;

  @Column() passwordSalt: string;

  @Column() passwordHash: string;

  @CreateDateColumn() createdAt: Date;
}