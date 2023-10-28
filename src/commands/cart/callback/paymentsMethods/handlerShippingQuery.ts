import { Telegraf } from "telegraf";
import { MyContext } from "../../../../models/types/MyContext";
import { ShippingOption } from "telegraf/typings/core/types/typegram";

export async function handlerShippingQuery(bot: Telegraf<MyContext>) {
  bot.on("shipping_query", async (ctx) => {
    const currency = ctx.shippingQuery.invoice_payload.slice(0, 3); // Валюта счета
    let shippingOptions: ShippingOption[] = [];

    if (currency === "RUB") {
      shippingOptions = [
        {
          id: "free",
          title: ctx.t("freeShipping"),
          prices: [{ label: ctx.t("freeShipping"), amount: 0 }],
        },
        {
          id: "express",
          title: ctx.t("expressShipping"),
          prices: [{ label: ctx.t("expressShipping"), amount: 10000 }],
        },
      ];
    } else if (currency === "GEL") {
      // Грузинский лари
      shippingOptions = [
        {
          id: "free",
          title: ctx.t("freeShipping"),
          prices: [{ label: ctx.t("freeShipping"), amount: 0 }],
        },
        {
          id: "express",
          title: ctx.t("expressShipping"),
          prices: [{ label: ctx.t("expressShipping"), amount: 1500 }], // Сумма в лари
        },
      ];
    }

    await ctx.answerShippingQuery(true, shippingOptions, "error");
  });

  bot.on("pre_checkout_query", async (ctx) => {
    await ctx.answerPreCheckoutQuery(true);
  });
}
