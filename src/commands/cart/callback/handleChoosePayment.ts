import { MyContext } from "../../../models/types/MyContext";

export async function handleChoosePayment(ctx: MyContext, message_id?: number) {
  if (ctx.chat && message_id) {
    await ctx.telegram.deleteMessage(ctx.chat.id, message_id);
  }
  // Добавляем кнопки для выбора способа оплаты
  await ctx.reply(ctx.t("choose-payment-method"), {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: ctx.t("pay_with_russian_card") + " 🇷🇺",
            callback_data: "pay_with_russian_card",
          },
        ],
        [
          {
            text: ctx.t("pay_with_georgian_card") + " 🇬🇪",
            callback_data: "pay_with_georgian_card",
          },
        ],
        [
          {
            text: ctx.t("pay_with_crypto") + " ₿",
            callback_data: "pay_with_crypto",
          },
        ],
      ],
    },
  });
}
