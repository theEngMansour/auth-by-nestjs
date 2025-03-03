import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendLoginEmail(email: string) {
    try {
      const today = new Date();
      await this.mailerService.sendMail({
        to: email,
        from: `<no-reply@my-nestjs-app.com>`,
        subject: 'Login by :',
        template: 'login',
        context: { today, email },
      });
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException();
    }
  }

  public async sendVerifyEmailTemplate(email: string, link: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: `<no-reply@my-nestjs-app.com>`,
        subject: 'Verify your account',
        template: 'verify-email',
        context: { link },
      });
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException();
    }
  }

  public async sendResetPasswordTemplate(
    email: string,
    resetPasswordLink: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: `<no-reply@my-nestjs-app.com>`,
        subject: 'Reset password',
        template: 'reset-password',
        context: { resetPasswordLink },
      });
    } catch (error) {
      console.error(error);
      throw new RequestTimeoutException();
    }
  }
}
