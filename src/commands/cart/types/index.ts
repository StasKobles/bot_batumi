export interface Invoice {
  invoice_id: number;
  status: string;
  hash: string;
  asset: string;
  amount: string;
  pay_url: string;
  created_at: string;
  allow_comments: boolean;
  allow_anonymous: boolean;
}

export interface getInvoicesResponse {
  items: Invoice[];
}

export interface getExchangeRatesResponse {
  is_valid: boolean;
  source: string;
  target: string;
  rate: string;
}
