import { Markup } from "telegraf";
import { MyContext } from "../../../models/types/MyContext";
import { Product } from "../../../models/types/Product";
import { formatProduct } from "../../../utils/formatProducts/formatProducts";
import { getProducts } from "../../../utils/getProducts/getProducts";

export let cachedProducts: Product[] | null = null;
export let sentMessageIds: number | null = null;

export function setCachedProducts(products: Product[] | null) {
  cachedProducts = products;
}

export async function sendProductMessage(ctx: MyContext) {
  if (cachedProducts && ctx.chat) {
    const product = cachedProducts[ctx.session.currentProductIndex];
    const message = formatProduct(ctx.t, product);
    const keyboard = Markup.inlineKeyboard([
      [
        ...cachedProducts.map((_, index) =>
          Markup.button.callback((index + 1).toString(), `product_${index}`)
        ),
      ],
      [Markup.button.callback(ctx.t("add-to-cart"), `add_${product.id}`)],
    ]).reply_markup;
    if (sentMessageIds !== null) {
      await ctx.deleteMessage(sentMessageIds);
    }
    const sentMessage = await ctx.replyWithPhoto(product.image_url, {
      caption: message,
      reply_markup: keyboard,
      parse_mode: "Markdown",
    });
    sentMessageIds = sentMessage.message_id;
  }
}
export async function handleProductsCommand(ctx: MyContext) {
  if (ctx.message?.message_id && ctx.chat?.id) {
    await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
  }

  if (!cachedProducts) {
    cachedProducts = await getProducts();
  }
  sentMessageIds = null; // Сброс массива
  await sendProductMessage(ctx);
}
