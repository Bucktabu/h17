import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class EmailConfirmationEntity {
  @PrimaryColumn() userId: number;

  @Column() confirmationCode: string;

  @Column() expirationDate: Date;

  @Column() isConfirmation: boolean;
}
