import {
  Invoice,
  getExchangeRatesResponse,
  getInvoicesResponse,
} from "../types";

require("dotenv").config();
const { CryptoPay } = require("@foile/crypto-pay-api");

const cryptoPay = new CryptoPay(process.env.CRYPTO_PAY_API_KEY, {
  hostname: "testnet-pay.crypt.bot",
  protocol: "https",
});

export async function createInvoice(price: number): Promise<Invoice | null> {
  try {
    if (price > 0) {
      const order = (await cryptoPay.createInvoice("TON", price)) as Invoice;
      return order;
    }
    console.error("Price under 0");
    return null;
    // Здесь вы можете добавить логику для ответа пользователю или другие действия.
  } catch (error) {
    console.error(`Error: ${error}`);
    return null;
  }
}

export async function getInvoices(
  invoice_ids?: number
): Promise<getInvoicesResponse | null> {
  try {
    const params: any = {
      asset: "TON",
      count: 10,
    };

    if (invoice_ids) {
      params.invoice_ids = invoice_ids;
    }

    const invoicesList = await cryptoPay.getInvoices(params);
    return invoicesList as getInvoicesResponse; // assuming invoicesList is of type getInvoicesResponse
  } catch (error) {
    console.error(`Error: ${error}`);
    return null;
  }
}

export async function getCurrencies() {
  try {
    const currencies = await cryptoPay.getCurrencies();
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export async function getExchangeRates(): Promise<
  getExchangeRatesResponse[] | null
> {
  try {
    const exchangeRates = await cryptoPay.getExchangeRates();
    return exchangeRates as getExchangeRatesResponse[];
  } catch (error) {
    console.error(`Error: ${error}`);
    return null;
  }
}
