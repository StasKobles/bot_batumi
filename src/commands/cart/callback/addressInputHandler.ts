import { Telegraf } from "telegraf";
import { MyContext } from "../../../models/types/MyContext";
import { payByCrypto } from "./paymentsMethods/payByCrypto";

export const setupAddressHandlers = (bot: Telegraf<MyContext>) => {
  bot.hears(/.*/, async (ctx: MyContext) => {
    if (ctx.session.addressStage) {
      const text = ctx.message && "text" in ctx.message ? ctx.message.text : "";

      if (ctx.session.addressStage === "city") {
        ctx.session.address.city = text;
        ctx.session.addressStage = "street";
        await ctx.reply(ctx.t("enter-street"));
      } else if (ctx.session.addressStage === "street") {
        ctx.session.address.street = text;
        ctx.session.addressStage = "house";
        await ctx.reply(ctx.t("enter-house"));
      } else if (ctx.session.addressStage === "house") {
        ctx.session.address.house = text;
        ctx.session.addressStage = "apartment";
        await ctx.reply(ctx.t("enter-apartment"));
      } else if (ctx.session.addressStage === "apartment") {
        ctx.session.address.apartment = text;
        ctx.session.addressStage = undefined;
        const fullAddress = `City: ${ctx.session.address.city}, Street: ${ctx.session.address.street}, House: ${ctx.session.address.house}, Apartment: ${ctx.session.address.apartment}`;
        await ctx.reply(
          `${ctx.t("address-saved")} \nYour address: ${fullAddress}`
        );
        await payByCrypto(ctx, ctx.callbackQuery?.message?.message_id);
      }
    }
  });
};
