import { Telegraf } from "telegraf";
import { MyContext } from "../../../models/types/MyContext";
import { payByCrypto } from "./paymentsMethods/payByCrypto";
import { helpTextHandler } from "../../../utils/channelMessages/helpTextHandler";

export const textHandler = (bot: Telegraf<MyContext>) => {
  bot.hears(/.*/, async (ctx) => {
    if (ctx.session.address === 'ready') {
      const text = ctx.message && "text" in ctx.message ? ctx.message.text : "";
      ctx.session.address = text;
      await ctx.reply(
        `${ctx.t("address-saved")} \n${ctx.t('your-address')}: ${text}`
      );
      await payByCrypto(ctx, ctx.message.message_id);

    } else {
      if (ctx.session.helpStep) {
        helpTextHandler(ctx);
      }
    }
  });
};
