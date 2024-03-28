import * as http from "http";
import { SocksProxyAgent } from "socks-proxy-agent";
import { btcPayApiKey, btcPayBaseUrl, btcPayStoreId } from "../../config";
import { BTCPayInvoice, BTCPayInvoiceCheck, BTCPayInvoiceResponse, OrderParams } from "./types";

export async function getBtcPayInvoices(): Promise<string> {
  const agent = new SocksProxyAgent("socks5h://localhost:9050");

  return new Promise((resolve, reject) => {
    const req = http.get(
      `${btcPayBaseUrl}/api/v1/stores/${btcPayStoreId}/invoices`,
      {
        agent,
        headers: {
          Authorization: `token ${btcPayApiKey}`,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );

    req.on("error", reject);
    req.end();
  });
}

export async function createBtcPayInvoice(orderParams:OrderParams): Promise<BTCPayInvoiceResponse> {
  const {cart,orderId,total} = orderParams
  // Преобразование корзины в формат данных для чека
  const cartForReceipt = cart.reduce((receipt, item) => {
    const itemTotal = item.price.formatted + " x " + item.count.toString() + " = $" + (item.price.value * item.count).toFixed(2);
    receipt[item.title] = itemTotal;
    return receipt;
  }, {} as Record<string, string>);
  const agent = new SocksProxyAgent("socks5h://localhost:9050");

  // Тестовые данные инвойса
  const invoiceData: BTCPayInvoice = {
    metadata: {
      orderId: orderId,
      orderUrl: "https://localhost:14142/apps/346KRC5BjXXXo8cRFKwTBmdR6ZJ4/pos",
      itemDesc: "Your Order From Batumi",
      posData: {
        tip: 0,
        cart: cart,
        total: total,
        subTotal: total,
        customAmount: 0,
        discountAmount: 0,
        discountPercentage: 0,
      },
      receiptData: {
        Tip: "$0.00",
        Cart: cartForReceipt,
      },
    },
    checkout: {
      speedPolicy: "HighSpeed",
      paymentMethods: ["BTC","LTC"],
      defaultPaymentMethod: "LTC",
      lazyPaymentMethods: true,
      expirationMinutes: 90,
      monitoringMinutes: 90,
      paymentTolerance: 0,
      redirectURL: "www.google.com",
      redirectAutomatically: true,
      requiresRefundEmail: true,
      checkoutType: null,
      defaultLanguage: "en",
    },
    receipt: {
      enabled: true,
      showQR: null,
      showPayments: null,
    },
    amount: total.toString(),
    currency: "USD",
    additionalSearchTerms: ["string"],
  };
  // Используйте invoiceData в вашей функции createBtcPayInvoice

  return new Promise((resolve, reject) => {
    const req = http.request(
      `${btcPayBaseUrl}/api/v1/stores/${btcPayStoreId}/invoices`,
      {
        agent,
        method: "POST",
        headers: {
          Authorization: `token ${btcPayApiKey}`,
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsedData: BTCPayInvoiceResponse = JSON.parse(data);
            resolve(parsedData);
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on("error", reject);

    // Отправляем данные инвойса
    req.write(JSON.stringify(invoiceData));

    req.end();
  });
}

export async function checkCryptoPaymentStatus(invoiceId: string): Promise<BTCPayInvoiceCheck> {
  const agent = new SocksProxyAgent("socks5h://localhost:9050");

  return new Promise<BTCPayInvoiceCheck>((resolve, reject) => {
    const url = `${btcPayBaseUrl}/api/v1/stores/${btcPayStoreId}/invoices/${invoiceId}`;
    const req = http.request(
      url,
      {
        agent,
        method: "GET",
        headers: {
          Authorization: `token ${btcPayApiKey}`,
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsedData: BTCPayInvoiceCheck = JSON.parse(data);
            resolve(parsedData);
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on("error", (error) => {
      console.error(error); // Логирование ошибки
      reject(error);
    });

    req.end(); // Не забудьте закрыть запрос
  });
}