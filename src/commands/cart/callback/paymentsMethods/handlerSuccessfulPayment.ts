import { Telegraf } from "telegraf";
import { MyContext } from "../../../../models/types/MyContext";
import { adminId } from "../../../../config";

export async function handlerSuccessfulPayment(bot: Telegraf<MyContext>) {
  bot.on("successful_payment", async (ctx) => {
    // Выводим всю информацию об успешной оплате в консоль
    console.log(
      "Информация об успешной оплате:",
      ctx.update.message?.successful_payment
    );
    // Получаем данные о способе и адресе доставки
    const shippingMethod =
      ctx.update.message?.successful_payment?.shipping_option_id;
    const shippingAddress =
      ctx.update.message?.successful_payment?.order_info?.shipping_address;

    // Получаем валюту и сумму
    const currency = ctx.update.message?.successful_payment?.currency;
    const totalAmount =
      ctx.update.message?.successful_payment?.total_amount / 100; // в базовых единицах валюты
    // Получаем корзину из сессии
    const cartItems = ctx.session.cart;

    // Формируем строку с перечнем заказанных товаров
    let itemsList = "Заказанные товары:\n";
    cartItems.forEach((item) => {
      itemsList += `- ${item.name} (ID: ${item.id}, Количество: ${item.quantity}, Цена: ${item.price})\n`;
    });

    // Сформируем сообщение для админа
    const adminMessage = `
            Новый успешный заказ!
            Имя пользователя: ${ctx.from?.first_name} ${ctx.from?.last_name}
            Сумма: ${totalAmount} ${currency}
            Идентификатор заказа: ${ctx.update.message?.successful_payment?.invoice_payload}
            Способ доставки: ${shippingMethod}
            Адрес доставки: ${shippingAddress?.street_line1}, ${shippingAddress?.city}, ${shippingAddress?.country_code}
            ${itemsList}
          `;

    // Отправляем сообщение админу
    await ctx.telegram.sendMessage(adminId, adminMessage);

    // Отправляем сообщение пользователю
    await ctx.reply(`${ctx.t("thanksForOrder")} ${totalAmount} ${currency}`);
  });
}
