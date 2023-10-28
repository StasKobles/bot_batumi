import { MyContext } from "../../../models/types/MyContext";
import { formatProduct } from "../../../utils/formatProducts/formatProducts";
import { getProducts } from "../../../utils/getProducts/getProducts";
import {
  cachedProducts,
  resetSentMessageIds,
  sentMessageIds,
  setCachedProducts,
} from "../command/handleProductsCommand";

export async function handleMoreProductsCallback(
  ctx: MyContext,
  message_id?: number
) {
  if (ctx.chat && message_id) {
    await ctx.telegram.deleteMessage(ctx.chat.id, message_id);
  }
  if (!cachedProducts) {
    setCachedProducts(await getProducts());
  }

  resetSentMessageIds(); // Сброс массива

  if (cachedProducts) {
    for (const product of cachedProducts) {
      const message = formatProduct(ctx.t, product);
      // const keyboard = createAddToCartButton(ctx,product.id).reply_markup

      const sentMessage = await ctx.replyWithPhoto(product.image_url, {
        caption: message,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: ctx.t("add-to-cart"),
                callback_data: `add_${product.id}`,
              },
            ],
          ],
        },
        parse_mode: "Markdown",
      });

      if (sentMessage.message_id) {
        sentMessageIds.push(sentMessage.message_id);
      }
    }
  }
}
