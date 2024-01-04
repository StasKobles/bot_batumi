import { createAddToCartKeyboard } from "../../../keyboards/inlineKeyboards";
import { MyContext } from "../../../models/types/MyContext";
import { Product } from "../../../models/types/Product";
import { getProducts } from "../../../utils/getProducts/getProducts";
import { sentMessageIds } from "../command/handleProductsCommand";

export async function handleAddToCartCallback(
  ctx: MyContext,
  cachedProducts: Product[],
  productId: number
) {
  // Проверка наличия поля "data" в callbackQuery

  if (!cachedProducts) {
    cachedProducts = await getProducts();
  }

  const product = cachedProducts.find((p) => p.id === productId);
  if (!product) {
    // Обработка ошибки: продукт не найден
    return;
  }

  // Удаляем все сообщения с товарами
  if (ctx.chat && sentMessageIds) {
    await ctx.telegram.deleteMessage(ctx.chat.id, sentMessageIds);
  }

  const keyboard = createAddToCartKeyboard(productId).reply_markup; // Убедитесь, что этот метод возвращает Telegraf-совместимую клавиатуру

  await ctx.reply(
    `${ctx.t("choose-quantity-1")} ${product.name} ${ctx.t(
      "choose-quantity-2"
    )}`,
    {
      reply_markup: keyboard,
      parse_mode: "Markdown",
    }
  );
}
