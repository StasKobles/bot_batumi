import { Telegraf } from "telegraf";
import { mainMenuKeyboard } from "../../../keyboards/inlineKeyboards";
import { MyContext } from "../../../models/types/MyContext";

export function menuCommand(bot: Telegraf<MyContext>) {
  bot.command("menu", async (ctx) => {
    await ctx.reply(ctx.t("choose-menu-option"), {
      reply_markup: mainMenuKeyboard(ctx.t).reply_markup,
    });
  });
}
