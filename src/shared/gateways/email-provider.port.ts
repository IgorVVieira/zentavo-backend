import { SendEmailDto } from '@shared/dtos/send-email.dto';

export interface IEmailProviderPort {
  sendEmail(data: SendEmailDto): Promise<void>;
}
