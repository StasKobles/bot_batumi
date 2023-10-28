import { Telegraf } from "telegraf";
import { createCartActionKeyboard } from "../../keyboards/inlineKeyboards";
import { MyContext } from "../../models/types/MyContext";
import { Product } from "../../models/types/Product";
import { formatCart } from "./utils/formatCart";
import { CartItem } from "../../models/types/Session";

// Реализация команды /cart
export function cartCommand(bot: Telegraf<MyContext>) {
  bot.command("cart", async (ctx) => {
    // Ваша логика для получения корзины и списка товаров (передайте их в аргументах ниже)
    const cart:CartItem[]= []; // Ваша логика для получения корзины
    const products: Product[] = []; // Ваша логика для получения списка товаров

    const cartText = formatCart(ctx, cart, products);
    const keyboard = createCartActionKeyboard(ctx.t).reply_markup;

    await ctx.reply(cartText, { reply_markup: keyboard });
  });
}
