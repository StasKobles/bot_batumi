import { createCartActionKeyboard } from "../../../keyboards/inlineKeyboards";
import { MyContext } from "../../../models/types/MyContext";
import { Product } from "../../../models/types/Product";
import { getProducts } from "../../../utils/getProducts/getProducts";
import { formatCart } from "../../cart/utils/formatCart";

export async function handleSetQuantityCallback(
  ctx: MyContext,
  cachedProducts: Product[],
  productId: number,
  quantity: number,
  messageId?: number
) {
  // Инициализация корзины, если она пуста
  ctx.session.cart = ctx.session.cart || [];

  // Поиск продукта в корзине
  const cartItemIndex = ctx.session.cart.findIndex(
    (item) => item.id === productId
  );

  if (cartItemIndex === -1) {
    // Добавляем новый продукт, если его еще нет в корзине
    const product = cachedProducts.find((p) => p.id === productId);
    if (product) {
      ctx.session.cart.push({
        name: product.name,
        id: productId,
        quantity: quantity,
        price: product.price,
      });
    }
  } else {
    // Изменяем количество, если продукт уже в корзине
    ctx.session.cart[cartItemIndex].quantity += quantity;
  }

  // Удаляем предыдущее сообщение
  if (ctx.chat && messageId) {
    await ctx.telegram.deleteMessage(ctx.chat.id, messageId);
  }

  if (!cachedProducts) {
    cachedProducts = await getProducts();
  }

  const cartText = formatCart(ctx, ctx.session.cart, cachedProducts); // Используем formatCart для получения текста корзины
  const keyboard = createCartActionKeyboard(ctx.t).reply_markup; // Убедитесь, что этот метод возвращает Telegraf-совместимую клавиатуру

  await ctx.reply(`${cartText}\n${ctx.t("next-steps")}`, {
    reply_markup: keyboard,
    parse_mode: "Markdown",
  });
}
