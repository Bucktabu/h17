import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailAdapters {
  async sendEmail(email: string, subject: string, message: string) {
    const transport = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'buckstabu030194@gmail.com',
        pass: 'czxfvurrxhdrghmz',
      },
    });

    const info = await transport.sendMail({
      from: 'MyBack-End <buckstabu030194@gmail.com>',
      to: email,
      subject: subject,
      html: message,
    });

    return info;
  }
}
