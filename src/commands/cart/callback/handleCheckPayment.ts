import { adminId } from "../../../config";
import { MyContext } from "../../../models/types/MyContext";
import { checkPaymentsStatus } from "../utils/checkPaymentsStatus";

export async function handleCheckPayment(ctx: MyContext) {
  if (ctx.session.invoice?.invoice_id) {
    const result = await checkPaymentsStatus(ctx.session.invoice.invoice_id);
    if (result) {
      // Получаем валюту и сумму
      const totalAmount = ctx.session.totalPrice;

      // Сформируем сообщение для админа
      // Получаем корзину из сессии
      const cartItems = ctx.session.cart;

      // Формируем строку с перечнем заказанных товаров
      let itemsList = "Заказанные товары:\n";
      cartItems.forEach((item) => {
        itemsList += `- ${item.name} (ID: ${item.id}, Количество: ${item.quantity}, Цена: ${item.price})\n`;
      });

      // Добавляем эту строку в сообщение для админа
      const adminMessage = `
          Новый успешный заказ!
          Имя пользователя: ${ctx.from?.first_name} ${ctx.from?.last_name}, tg://user?id=${ctx.from?.id}
          ${itemsList}
          Сумма: ${totalAmount} GEL
          Адрес доставки: ${ctx.session.address}
        `;

      // Отправляем сообщение админу
      await ctx.telegram.sendMessage(adminId, adminMessage);

      // Отправляем сообщение пользователю
      await ctx.reply(`${ctx.t("thanksForOrder")} ${totalAmount} GEL`);
      await ctx.editMessageText(ctx.t("payment_success"));
    } else {
      await ctx.editMessageText(ctx.t("payment_pending"), {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: ctx.t("check_payment_button"),
                callback_data: "check_payment",
              },
            ],
          ],
        },
      });
    }
  }
}
