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
  await ctx.reply(ctx.t("welcomeMessage"));
}
