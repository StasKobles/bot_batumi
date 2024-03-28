import { Markup } from "telegraf";
import { MyContext } from "../../../../models/types/MyContext";
import { createBtcPayInvoice } from "../../../../services/btcPayServerApi/getInvoices";
import {
  CartItemForCrypto
} from "../../../../services/btcPayServerApi/types";
const CurrencyConverter = require("currency-converter-lt") as any;



async function convertGELtoUSD(amountInGEL: number): Promise<number> {
  const converter = new CurrencyConverter({ from: "GEL", to: "USD", amount: amountInGEL });
  try {
    const amountInUSD = await converter.convert();
    return amountInUSD;
  } catch (error) {
    console.error('Ошибка при конвертации валюты: ', error);
    throw new Error('Ошибка при конвертации валюты');
  }
}

export async function payByCrypto(ctx: MyContext, message_id?: number) {
  if (ctx.chat && message_id) {
    await ctx.telegram.deleteMessage(ctx.chat.id, message_id);
  }

  const totalPrice = await convertGELtoUSD(ctx.session.totalPrice)

  await ctx.reply(ctx.t("sending_request"));
  const orderId = `user_${ctx.from?.id}_time_${Date.now()}`;
  const cartForCrypto: CartItemForCrypto[] = ctx.session.cart.map((item) => ({
    id: item.id.toString(), // Преобразование id в строку, если требуется
    count: item.quantity,
    image: "", // Укажи здесь путь к изображению товара
    price: {
      type: 2, // Установи соответствующий тип
      value: item.price,
      formatted: `$${item.price}`, // Форматирование цены
    },
    title: item.name,
    inventory: null, // Установи соответствующий тип, если доступен
  }));
  const res = await createBtcPayInvoice({
    total: totalPrice,
    cart: cartForCrypto,
    orderId,
  });
  await ctx.reply(`${ctx.t('onion-link')}`);
  await ctx.reply(`${res.checkoutLink}`);
  await ctx.reply(ctx.t("text-to-pay"), {
    reply_markup: Markup.inlineKeyboard([
      Markup.button.callback(
        ctx.t("check-payment-button"),
        `check_cryptopayment_${res.id}`
      ),
    ]).reply_markup,
  });
}
