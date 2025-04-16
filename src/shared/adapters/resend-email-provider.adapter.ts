import { Resend } from 'resend';
import { injectable } from 'tsyringe';

import { SendEmailDto } from '@shared/dtos/send-email.dto';
import { IEmailProviderPort } from '@shared/gateways/email-provider.port';

@injectable()
export class ResendEmailProvider implements IEmailProviderPort {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(data: SendEmailDto): Promise<void> {
    try {
      await this.resend.emails.send({
        from: process.env.SENDER_EMAIL as string,
        to: data.to,
        subject: data.subject,
        html: data.body,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
