import { MyContext } from "../models/types/MyContext";

export const createAddToCartKeyboard = (productId: number) => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "1", callback_data: `set_${productId}_1` },
          { text: "2", callback_data: `set_${productId}_2` },
          { text: "3", callback_data: `set_${productId}_3` },
          { text: "4", callback_data: `set_${productId}_4` },
          { text: "5", callback_data: `set_${productId}_5` },
        ],
      ],
    },
  };
};

export const createCartActionKeyboard = (t: MyContext["t"]) => {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: t("look-more"), callback_data: "more_products" }],
        [{ text: t("go-to-payment"), callback_data: "checkout" }],
        [{ text: t("clear-cart"), callback_data: "clear_cart" }],
      ],
    },
  };
};

export const createAddToCartButton = (ctx: MyContext, productId: number) => {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: ctx.t("add-to-cart"), callback_data: `add_${productId}` }],
      ],
    },
  };
};
