import { Telegraf } from "telegraf";
import { handleCheckPayment } from "../../commands/cart/callback/handleCheckPayment";
import { handleRequestAddress } from "../../commands/cart/callback/handleRequestAddress";
import { handleChoosePayment } from "../../commands/cart/callback/handleChoosePayment";
import { handleAddToCartCallback } from "../../commands/products/callbacks/handleAddToCartCallback";
import { handleClearCartCallback } from "../../commands/products/callbacks/handleClearCartCallback";
import { handleMoreProductsCallback } from "../../commands/products/callbacks/handleMoreProductsCallback";
import { handleSetQuantityCallback } from "../../commands/products/callbacks/handleSetQuantityCallback";
import { cachedProducts } from "../../commands/products/command/handleProductsCommand";
import { handleStartCallback } from "../../commands/start/handleStartCallback";
import { MyContext } from "../../models/types/MyContext";
import { Languages } from "../../models/types/Session";
import { payByCrypto } from "../../commands/cart/callback/paymentsMethods/payByCrypto";
import { handleRussianCardPayment } from "../../commands/cart/callback/paymentsMethods/payByRussianCard";
import { handleGeorgianCardPayment } from "../../commands/cart/callback/paymentsMethods/payByGeorgianCard";

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
      } else if (data === "more_products") {
        await handleMoreProductsCallback(
          ctx,
          ctx.callbackQuery.message?.message_id
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
      }
    }
  });
}
