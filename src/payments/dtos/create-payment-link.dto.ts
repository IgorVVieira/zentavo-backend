export class CreatePaymentLinkRequestDto {
  userId: string;
}

export class CreatePaymentLinkDtoResponse {
  url: string;
  paymentId: string;
  customerId: string;
}

export class PaymentLinkDto {
  url: string;
}
