import { Telegraf } from "telegraf";
import { MyContext } from "../../models/types/MyContext";
import { adminChatId } from "../../config";

export const channelMessagesController = (bot: Telegraf<MyContext>) => {
  bot.on("channel_post", async (ctx) => {
    const channelPost = ctx.update.channel_post;
    const chatId = channelPost.chat.id.toString(); // Получение ID чата

    if (
      channelPost &&
      "text" in channelPost &&
      "message_id" in channelPost &&
      "reply_to_message" in channelPost &&
      channelPost.reply_to_message &&
      "text" in channelPost.reply_to_message &&
      channelPost.reply_to_message.text
    ) {
      // Парсинг текста сообщения, чтобы получить идентификатор пользователя
      const userId =
        channelPost.reply_to_message.text.match(/\(ID: (\d+)\)/)?.[1] || "";

      if (userId && chatId === adminChatId) {
        // Отправка сообщения пользователю
        const replyMessage = `
          🌟 Вам пришел ответ от нашего специалиста! 🌟
          
          "${channelPost.text}"
          `;

        // Отправка объединенного сообщения
        await ctx.telegram.sendMessage(userId, replyMessage);
      } else {
        console.error(
          "Не удалось извлечь идентификатор пользователя из текста сообщения в канале."
        );
      }
    }
  });
};
