import { Telegraf } from "telegraf";
import { handleCheckPayment } from "../../commands/cart/callback/handleCheckPayment";
import { handleChoosePayment } from "../../commands/cart/callback/handleChoosePayment";
import { handleRequestAddress } from "../../commands/cart/callback/handleRequestAddress";
import { handleGeorgianCardPayment } from "../../commands/cart/callback/paymentsMethods/payByGeorgianCard";
import { handleRussianCardPayment } from "../../commands/cart/callback/paymentsMethods/payByRussianCard";
import { handleAddToCartCallback } from "../../commands/products/callbacks/handleAddToCartCallback";
import { handleClearCartCallback } from "../../commands/products/callbacks/handleClearCartCallback";
import { handleSetQuantityCallback } from "../../commands/products/callbacks/handleSetQuantityCallback";
import {
  cachedProducts,
  handleProductsCommand,
  sendProductMessage,
} from "../../commands/products/command/handleProductsCommand";
import { handleStartCallback } from "../../commands/start/handleStartCallback";
import { MyContext } from "../../models/types/MyContext";
import { Languages } from "../../models/types/Session";
import { handleHelpCommand } from "../../commands/help/command/helpCommand";
import { checkCryptoPaymentStatus } from "../../services/btcPayServerApi/getInvoices";
import { adminId } from "../../config";

export async function createCallbackQuery(bot: Telegraf<MyContext>) {
  bot.on("callback_query", async (ctx) => {
    if ("data" in ctx.callbackQuery) {
      const data = ctx.callbackQuery.data;
      const addMatch = data.match(/^add_(\d+)$/);
      const setMatch = data.match(/^set_(\d+)_(\d+)$/);
      const setLanguage = ["en", "ru", "ka"].includes(data);
      if (setLanguage) {
        await handleStartCallback(
          ctx,
          data as Languages,
          ctx.callbackQuery.message?.message_id
        );
      }

      if (addMatch) {
        const productId = parseInt(addMatch[1]);
        await handleAddToCartCallback(ctx, cachedProducts || [], productId);
      } else if (setMatch) {
        const productId = parseInt(setMatch[1]);
        const quantity = parseInt(setMatch[2]);
        const messageId = ctx.callbackQuery.message?.message_id;
        await handleSetQuantityCallback(
          ctx,
          cachedProducts || [],
          productId,
          quantity,
          messageId
        );
      } else if (data === "checkout") {
        await handleChoosePayment(ctx, ctx.callbackQuery.message?.message_id);
      } else if (data === "clear_cart") {
        await handleClearCartCallback(
          ctx,
          ctx.callbackQuery.message?.message_id
        );
      } else if (data === "check_payment") {
        await handleCheckPayment(ctx);
      } else if (data === "pay_with_crypto") {
        await handleRequestAddress(ctx, ctx.callbackQuery.message?.message_id);
      } else if (data === "pay_with_russian_card") {
        await handleRussianCardPayment(
          ctx,
          ctx.callbackQuery.message?.message_id
        );
      } else if (data === "pay_with_georgian_card") {
        await handleGeorgianCardPayment(
          ctx,
          ctx.callbackQuery.message?.message_id
        );
      } else if (data === "products_list") {
        await ctx.deleteMessage(ctx.message);
        await handleProductsCommand(ctx);
      } else if (data === "about_shop") {
        await ctx.deleteMessage(ctx.message);
        await ctx.sendMessage(ctx.t("aboutShopMessage"), {
          parse_mode: "Markdown",
        });
      } else if (data === "rules") {
        await ctx.deleteMessage(ctx.message);
        await ctx.sendMessage(ctx.t("storeRules"));
      } else if (data === "help_action") {
        handleHelpCommand(ctx);
      } else if (data === "delivery") {
        await ctx.deleteMessage(ctx.message);
        await ctx.sendMessage(ctx.t("deliveryInfo"));
      } else if (data === "pre_order") {
        await ctx.deleteMessage(ctx.message);
        await ctx.sendMessage(ctx.t("preOrderInfo"));
      } else if (data.startsWith(`product`)) {
        ctx.session.currentProductIndex = parseInt(data.split("_")[1]);
        await sendProductMessage(ctx);
      } else if (data.startsWith("check_cryptopayment")) {
        const id = data.split("_")[2];
        const paymentStatus = await checkCryptoPaymentStatus(id);
        if (paymentStatus.status === "New") {
          await ctx.sendMessage(ctx.t("payment_pending"));
        }
        if (paymentStatus.status === "Settled") {
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

          await ctx.sendMessage(ctx.t("payment_success"));
        }
        if (paymentStatus.status === "Expired") {
          await ctx.sendMessage(ctx.t("payment_expired"));
          await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
        }
      }
    }
  });
}
