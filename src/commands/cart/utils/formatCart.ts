import { MyContext } from "../../../models/types/MyContext";
import { Product } from "../../../models/types/Product";
import { CartItem } from "../../../models/types/Session";

// Функция для формирования текста корзины

export function formatCart(
  ctx: MyContext,
  cart: CartItem[],
  products: Product[]
) {
  let cartText = ctx.t("cart-summary") + "\n\n"; // Заголовок корзины
  let totalPrice = 0;

  if (!cart || cart.length === 0) {
    cartText += ctx.t("cart-empty"); // Текст, если корзина пуста
  } else {
    for (const cartItem of cart) {
      const product = products.find((p) => p.name === cartItem.name);
      if (product) {
        const productPrice = cartItem.price * cartItem.quantity;
        cartText += `${cartItem.name} - ${cartItem.quantity} x ${cartItem.price} = ${productPrice}\n`;
        totalPrice += productPrice;
      }
    }
    cartText += `\n${ctx.t("total-price")}: ${totalPrice} ${ctx.t("currency")}`;
  }

  ctx.session.totalPrice = totalPrice; // Сохраняем totalPrice в сессии
  return cartText;
}

