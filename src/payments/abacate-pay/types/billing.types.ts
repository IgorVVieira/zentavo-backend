import { AbacatePayBillingFrequency } from '../enums/billing-frequency.enum';
import { AbacatePayBillingStatus } from '../enums/billing-status.enum';
import { AbacatePayPaymentMethod } from '../enums/payment-method.enum';
import { AbacatePayWebhookEvent } from '../enums/webhook-event.enum';

export interface IAbacatePayBillingProduct {
  externalId: string;
  name: string;
  description?: string;
  quantity: number;
  price: number; // In centavos (minimum 100)
}

export interface IAbacatePayBillingCustomer {
  name: string;
  cellphone: string;
  email: string;
  taxId: string;
}

export interface IAbacatePayCreateBillingRequest {
  frequency: AbacatePayBillingFrequency;
  methods: AbacatePayPaymentMethod[]; // 1-2 unique items
  products: IAbacatePayBillingProduct[]; // Minimum 1 item
  returnUrl: string;
  completionUrl: string;
  description?: string;
  customerId?: string;
  customer?: IAbacatePayBillingCustomer;
  allowCoupons?: boolean;
  coupons?: string[]; // Max 50 items
  externalId?: string;
  metadata?: Record<string, unknown>;
}

// Customer in response
export interface IAbacatePayBillingCustomerResponse {
  id: string;
  name?: string;
  cellphone?: string;
  email?: string;
  taxId?: string;
}

// Product in response (includes generated IDs)
export interface IAbacatePayBillingProductResponse extends IAbacatePayBillingProduct {
  id: string;
}

export interface IAbacatePayBaseResponse<T> {
  success: boolean;
  error: unknown;
  data?: T;
}

export interface IAbacatePayCreateBillingResponse {
  id: string;
  url: string;
  status: AbacatePayBillingStatus;
  devMode: boolean;
  methods: AbacatePayPaymentMethod[];
  products: IAbacatePayBillingProductResponse[];
  frequency: AbacatePayBillingFrequency;
  nextBilling?: string; // ISO datetime
  customer?: IAbacatePayBillingCustomerResponse;
  allowCoupons?: boolean;
  coupons?: string[];
  description?: string;
  externalId?: string;
  metadata?: Record<string, unknown>;
}

export interface IAbacatePayBillingPaidWebhook {
  id: string;
  data: {
    payment: {
      amount: number;
      fee: number;
      method: AbacatePayPaymentMethod;
    };
    billing: {
      amount: number;
      couponsUsed: string[];
      customer: IAbacatePayBillingCustomerResponse;
      frequency: AbacatePayBillingFrequency;
      id: string;
      kind: AbacatePayPaymentMethod[];
      paidAmount: number;
      products: IAbacatePayBillingProductResponse[];
      status: AbacatePayBillingStatus;
    };
  };
  devMode: boolean;
  event: AbacatePayWebhookEvent;
}

// {
//   "id": "log_12345abcdef",
//   "data": {
//     "payment": {
//       "amount": 1000,
//       "fee": 80,
//       "method": "PIX"
//     },
//     "billing": {
//       "amount": 1000,
//       "couponsUsed": [],
//       "customer": {
//         "id": "cust_4hnLDN3YfUWrwQBQKYMwL6Ar",
//         "metadata": {
//           "cellphone": "11111111111",
//           "email": "christopher@abacatepay.com",
//           "name": "Christopher Ribeiro",
//           "taxId": "12345678901"
//         }
//       },
//       "frequency": "ONE_TIME",
//       "id": "bill_QgW1BT3uzaDGR3ANKgmmmabZ",
//       "kind": [
//         "PIX"
//       ],
//       "paidAmount": 1000,
//       "products": [
//         {
//           "externalId": "123",
//           "id": "prod_RGKGsjBWsJwRn1mHyGMFJNjP",
//           "quantity": 1
//         }
//       ],
//       "status": "PAID"
//     }
//   },
//   "devMode": false,
//   "event": "billing.paid"
// }
