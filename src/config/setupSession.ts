import { Middleware } from "telegraf";
import { MyContext } from "../models/types/MyContext";
import { translate } from "../services/translate/translate";

export const setupSession: Middleware<MyContext> = (ctx, next) => {
  if (!ctx.session) {
    ctx.session = {
      address: {},
      addressStage: undefined,
      cart: [],
      language: "en",
      lastCartMessageId: null,
      totalPrice: 0,
    };
  }

  ctx.t = (key: string) => {
    const lang = ctx.session?.language || "en";
    return translate(key, lang);
  };

  return next();
};
