import { Markup } from "telegraf";
import { MyContext } from "../../../models/types/MyContext";
import { Product } from "../../../models/types/Product";
import { formatProduct } from "../../../utils/formatProducts/formatProducts";
import { getProducts } from "../../../utils/getProducts/getProducts";

export let cachedProducts: Product[] | null = null;
export let sentMessageIds: number[] = [];

export function setCachedProducts(products: Product[] | null) {
  cachedProducts = products;
}

export function resetSentMessageIds() {
  sentMessageIds = [];
}

export function addSentMessageId(id: number) {
  sentMessageIds.push(id);
}

export async function handleProductsCommand(ctx: MyContext) {
  if (ctx.message?.message_id && ctx.chat?.id) {
    await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
  }

  if (!cachedProducts) {
    cachedProducts = await getProducts();
  }
  sentMessageIds = []; // Сброс массива
  for (const product of cachedProducts) {
    const message = formatProduct(ctx.t, product);
    const keyboard = Markup.inlineKeyboard([
      Markup.button.callback(ctx.t("add-to-cart"), `add_${product.id}`),
    ]).reply_markup;

    const sentMessage = await ctx.replyWithPhoto(product.image_url, {
      caption: message,
      reply_markup: keyboard,
      parse_mode: "Markdown",
    });

    if (sentMessage.message_id) {
      sentMessageIds.push(sentMessage.message_id);
    }
  }
}
