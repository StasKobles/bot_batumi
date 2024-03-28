interface Price {
  type: number;
  value: number;
  formatted: string;
}

export interface CartItemForCrypto {
  id: string;
  count: number;
  image: string;
  price: Price;
  title: string;
  inventory: any; // Уточни тип, если возможно
}

interface PosData {
  tip: number;
  cart: CartItemForCrypto[];
  total: number;
  subTotal: number;
  customAmount: number;
  discountAmount: number;
  discountPercentage: number;
}

interface ReceiptData {
  Tip: string;
  Cart: { [key: string]: string }; // Ключ - название товара, значение - строка с описанием
}

interface Metadata {
  orderId: string;
  orderUrl: string;
  itemDesc: string;
  posData: PosData;
  receiptData: ReceiptData;
}

interface Checkout {
  speedPolicy: string;
  paymentMethods: string[];
  defaultPaymentMethod: string;
  lazyPaymentMethods: boolean;
  expirationMinutes: number;
  monitoringMinutes: number;
  paymentTolerance: number;
  redirectURL: string;
  redirectAutomatically: boolean;
  requiresRefundEmail: boolean;
  checkoutType: any; // Уточни тип, если возможно
  defaultLanguage: string;
}

interface Receipt {
  enabled: boolean;
  showQR: any; // Уточни тип, если возможно
  showPayments: any; // Уточни тип, если возможно
}

export interface BTCPayInvoice {
  metadata: Metadata;
  checkout: Checkout;
  receipt: Receipt;
  amount: string;
  currency: string;
  additionalSearchTerms: string[];
}

interface Price {
  type: number;
  value: number;
  formatted: string;
}

export interface CartItem {
  id: string;
  count: number;
  image: string;
  price: Price;
  title: string;
  inventory: any; // Замените 'any' на более конкретный тип, если доступен
}

interface PosData {
  tip: number;
  cart: CartItemForCrypto[];
  total: number;
  subTotal: number;
  customAmount: number;
  discountAmount: number;
  discountPercentage: number;
}

interface ReceiptDataMap {
  [key: string]: string; // Ключ - название товара, значение - цена
}

interface Metadata {
  orderId: string;
  orderUrl: string;
  itemDesc: string;
  posData: PosData;
  receiptData: {
    Tip: string;
    Cart: ReceiptDataMap;
  };
}

interface Checkout {
  speedPolicy: string;
  paymentMethods: string[];
  defaultPaymentMethod: string;
  lazyPaymentMethods: boolean;
  expirationMinutes: number;
  monitoringMinutes: number;
  paymentTolerance: number;
  redirectURL: string;
  redirectAutomatically: boolean;
  requiresRefundEmail: boolean;
  checkoutType: any; // Замените 'any' на более конкретный тип, если доступен
  defaultLanguage: string;
}

interface Receipt {
  enabled: boolean;
  showQR: any; // Замените 'any' на более конкретный тип, если доступен
  showPayments: any; // Замените 'any' на более конкретный тип, если доступен
}

export interface BTCPayInvoiceResponse {
  metadata: Metadata;
  checkout: Checkout;
  receipt: Receipt;
  id: string;
  storeId: string;
  amount: string;
  currency: string;
  type: string;
  checkoutLink: string;
  createdTime: number;
  expirationTime: number;
  monitoringExpiration: number;
  status: string;
  additionalStatus: string;
  availableStatusesForManualMarking: string[];
  archived: boolean;
}

export interface BTCPayInvoiceCheck {
  metadata: {
    orderId: string;
    orderUrl: string;
    itemDesc: string;
    posData: {
      tip: number;
      cart: {
        id: string;
        count: number;
        image: string;
        price: {
          type: number;
          value: number;
          formatted: string;
        };
        title: string;
        inventory: any; // You can specify the type of inventory if needed
      }[];
      total: number;
      subTotal: number;
      customAmount: number;
      discountAmount: number;
      discountPercentage: number;
    };
    receiptData: {
      Tip: string;
      Cart: Record<string, string>;
    };
  };
  checkout: {
    speedPolicy: string;
    paymentMethods: string[];
    defaultPaymentMethod: string;
    lazyPaymentMethods: boolean;
    expirationMinutes: number;
    monitoringMinutes: number;
    paymentTolerance: number;
    redirectURL: string;
    redirectAutomatically: boolean;
    requiresRefundEmail: boolean;
    checkoutType: string | null;
    defaultLanguage: string;
  };
  receipt: {
    enabled: boolean;
    showQR: string | null;
    showPayments: string | null;
  };
  id: string;
  storeId: string;
  amount: string;
  currency: string;
  type: string;
  checkoutLink: string;
  createdTime: number;
  expirationTime: number;
  monitoringExpiration: number;
  status: string;
  additionalStatus: string;
  availableStatusesForManualMarking: string[];
  archived: boolean;
}

export interface OrderParams {
  orderId: string;
  cart: CartItemForCrypto[];
  total: number;
}
