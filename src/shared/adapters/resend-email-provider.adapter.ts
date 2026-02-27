import { Resend } from 'resend';
import { injectable } from 'tsyringe';

import { SendEmailDto } from '@shared/dtos/send-email.dto';
import { IEmailProviderPort } from '@shared/gateways/email-provider.port';

@injectable()
export class ResendEmailProviderAdapter implements IEmailProviderPort {
  private readonly resendClient: Resend;

  constructor() {
    this.resendClient = new Resend(process.env.RESEND_API_KEY as string);
  }

  async sendEmail(sendEmailData: SendEmailDto): Promise<void> {
    const { to, subject, body } = sendEmailData;

    await this.resendClient.emails.send({
      from: process.env.SENDER_EMAIL as string,
      to,
      subject,
      html: body,
    });
  }
}
