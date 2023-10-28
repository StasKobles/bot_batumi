import { Telegraf } from "telegraf";
import { MyContext } from "../../models/types/MyContext";

export function startCommand(bot: Telegraf<MyContext>) {
  bot.command("start", async (ctx) => {
    // Здесь тип ctx будет MyContext
    return ctx.reply(ctx.t("choose_language"), {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Русский", callback_data: "ru" }],
          [{ text: "English", callback_data: "en" }],
          [{ text: "ქართული", callback_data: "ka" }],
        ],
      },
    });
  });
}
