import { PaymentChargeType } from '../../constant/enum';

export interface UPaymentProduct {
    name: string;
    price: number;
    quantity: number;
    description?: string;
}

export interface UPaymentService {
    name: string;
    price: number;
    date: Date;
    quantity: number;
    description?: string;
}

export interface UPaymentOrder {
    id: string;
    reference: string;
    description: string;
    currency: string;
    amount: number;
}

export interface UPaymentGateway {
    src: string | string[];
}

export interface UPaymentReference {
    id: string;
}

export interface UPaymentCustomer {
    uniqueId: string;
    name: string;
    email: string;
    mobile: string;
}

export interface UPaymentMerchant {
    amount: number;
    knetCharge: number;
    knetChargeType: PaymentChargeType;
    ccCharge: number;
    ccChargeType: PaymentChargeType;
    ibanNumber: string;
}

export interface UPaymentRequest {
    products: UPaymentProduct[] | UPaymentService;
    order: UPaymentOrder;
    paymentGateway: UPaymentGateway;
    language: string;
    reference: UPaymentReference;
    customer: UPaymentCustomer;
    extraMerchantData: UPaymentMerchant[];
    returnUrl: string;
    cancelUrl: string;
    notificationUrl: string;
    customerExtraData: string;
}
