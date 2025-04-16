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

  async sendEmail(sendEmailData: SendEmailDto): Promise<void> {
    try {
      const { to, subject, body } = sendEmailData;
      const { error } = await this.resend.emails.send({
        from: process.env.SENDER_EMAIL as string,
        to,
        subject,
        html: body,
      });

      if (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
