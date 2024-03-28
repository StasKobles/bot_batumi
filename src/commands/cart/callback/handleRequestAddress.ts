import { MyContext } from "../../../models/types/MyContext";

export async function handleRequestAddress(
  ctx: MyContext,
  message_id?: number
) {
  // Удаляем предыдущую клавиатуру или сообщение, если нужно
  if (ctx.chat && message_id) {
    await ctx.telegram.deleteMessage(ctx.chat.id, message_id);
  }
  ctx.session.address = 'ready'
  await ctx.reply(ctx.t("enter-city"));
}
