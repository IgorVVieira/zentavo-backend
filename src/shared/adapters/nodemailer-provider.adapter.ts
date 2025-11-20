import nodemailer from 'nodemailer';

import { SendEmailDto } from '@shared/dtos/send-email.dto';
import { IEmailProviderPort } from '@shared/gateways/email-provider.port';

export class NodemailerEmailProvider implements IEmailProviderPort {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(sendEmailData: SendEmailDto): Promise<void> {
    try {
      const { to, subject, body } = sendEmailData;

      await this.transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        html: body,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
