import { Markup } from "telegraf";
import { MyContext } from "../../../../models/types/MyContext";
import { findRate } from "../../utils/checkPaymentsStatus";
import { createInvoice } from "../createTransaction";

export async function payByCrypto(ctx: MyContext, message_id?: number) {
  if (ctx.chat && message_id) {
    await ctx.telegram.deleteMessage(ctx.chat.id, message_id);
  }
  const totalPrice = ctx.session.totalPrice;

  const rates = await findRate();

  if (typeof rates !== "string") {
    await ctx.reply(ctx.t("error-getting-crypto-rates"));
    return;
  }

  const newInvoice = await createInvoice(totalPrice / Number(rates));

  if (newInvoice === null) {
    await ctx.reply(ctx.t("error-to-invoice"));
    return;
  }

  ctx.session.invoice = newInvoice;

  await ctx.reply(ctx.t("text-to-pay"), {
    reply_markup: Markup.inlineKeyboard([
      Markup.button.url(ctx.t("pay-button"), newInvoice.pay_url),
      Markup.button.callback(ctx.t("check-payment-button"), "check_payment"),
    ]).reply_markup,
  });
}
