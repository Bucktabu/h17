import { Inject, Injectable, PipeTransform } from '@nestjs/common';
import { EmailConfirmationService } from '../modules/super-admin/application/emailConfirmation.service';
import { IUsersRepository } from '../modules/super-admin/infrastructure/users/users-repository.interface';

@Injectable()
export class EmailResendingValidationPipe implements PipeTransform {
  constructor(
    protected emailConfirmationService: EmailConfirmationService,
    @Inject(IUsersRepository) protected usersRepository: IUsersRepository,
  ) {}

  async transform(dto, metadata) {
    const email = dto.email;
    const user = await this.usersRepository.getUserByIdOrLoginOrEmail(email);

    if (!user) {
      return false;
    }

    const isConfirmed = await this.emailConfirmationService.checkConfirmation(
      user.id,
    );

    if (isConfirmed) {
      return false;
    }

    return user;
  }
}
