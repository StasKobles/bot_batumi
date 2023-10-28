import { MyContext } from "../../../models/types/MyContext";

export async function handleClearCartCallback(
  ctx: MyContext,
  message_id?: number
) {
  ctx.session.cart = []; // Очистка корзины

  if (message_id && ctx.chat) {
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      message_id,
      undefined,
      ctx.t("cart-is-empty"), // Новый текст
      {
        parse_mode: "Markdown",
      }
    );
  }
  await ctx.answerCbQuery(ctx.t("cart-cleared"));
}
