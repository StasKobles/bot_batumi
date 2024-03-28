import { NarrowedContext } from "telegraf";
import { adminChatId } from "../../config";
import { MyContext } from "../../models/types/MyContext";
import { Update, Message } from "telegraf/typings/core/types/typegram";

export const helpTextHandler = async (
  ctx: NarrowedContext<
    MyContext,
    {
      message: Update.New & Update.NonChannel & Message.TextMessage;
      update_id: number;
    }
  >
) => {
  try {
    // Получаем текст сообщения пользователя
    const userMessage = ctx.message.text;

    // Получаем информацию о пользователе
    const userId = ctx.from.id;
    const userName = ctx.from.username || "Без имени";

    // Формируем сообщение для админа
    const messageForAdmin = `Сообщение от пользователя @${userName} (ID: ${userId}):\n${userMessage}`;

    await ctx.telegram.sendMessage(adminChatId, messageForAdmin);

    // Отправляем подтверждение пользователю
    await ctx.reply("Ваше сообщение было отправлено администратору.");
    ctx.session.helpStep = false;
  } catch (error) {
    console.error("Ошибка при пересылке сообщения:", error);
    await ctx.reply(
      "Произошла ошибка при отправке вашего сообщения администратору."
    );
    ctx.session.helpStep = false;
  }
};
