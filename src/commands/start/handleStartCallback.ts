import { MyContext } from "../../models/types/MyContext";
import { Languages } from "../../models/types/Session";

export async function handleStartCallback(
  ctx: MyContext,
  data: Languages,
  messageId?: number
) {
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); // Убираем клавиатуру

  if (ctx.chat && messageId) {
    await ctx.telegram.deleteMessage(ctx.chat.id, messageId);
  } // Удаляем сообщение с выбором языка

  ctx.session.language = data;
  await ctx.answerCbQuery();
  await ctx.reply(ctx.t("welcomeMessage"), {
    reply_markup: {
      inline_keyboard: [
        [
          { text: ctx.t("productsList"), callback_data: "products_list" },
          { text: ctx.t("preOrder"), callback_data: "pre_order" },
        ],
        [
          { text: ctx.t("aboutShop"), callback_data: "about_shop" },
          { text: ctx.t("rules"), callback_data: "rules" },
        ],
        [
          { text: ctx.t("help"), callback_data: "help" },
          { text: ctx.t("delivery"), callback_data: "delivery" },
        ],
      ],
    },
  });
}
