import { Telegraf } from "telegraf";
import { MyContext } from "../../../models/types/MyContext";

export const handleHelpCommand = (ctx: MyContext) => {
  ctx.deleteMessage();
  ctx.reply(ctx.t("preHelpMessage"));
  ctx.session.helpStep = true;
};

export function helpCommand(bot: Telegraf<MyContext>) {
  bot.command("help", async (ctx) => {
    handleHelpCommand(ctx);
  });
}
