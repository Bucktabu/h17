export class EmailConfirmationModel {
  constructor(
    public id: string,
    public confirmationCode: string,
    public expirationDate: Date,
    public isConfirmed: boolean,
  ) {}
}
