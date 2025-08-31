import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendMailForgotPassword(toEmail: string, resetCode: string) {
    try {
      this.mailerService.sendMail({
        to: toEmail,
        subject: 'Password Reset Code',
        context: {
          resetCode,
          year: new Date().getFullYear(),
        },
        template: 'forgot-password',
      });
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${toEmail}`);
    }
  }
}
