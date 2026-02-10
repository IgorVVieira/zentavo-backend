import { AbacatePayBillingFrequency } from '../enums/billing-frequency.enum';
import { AbacatePayBillingStatus } from '../enums/billing-status.enum';
import { AbacatePayPaymentMethod } from '../enums/payment-method.enum';

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
