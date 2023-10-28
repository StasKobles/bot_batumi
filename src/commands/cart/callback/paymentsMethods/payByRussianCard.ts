import axios from "axios"; // Используем для запроса курса валют
import { MyContext } from "../../../../models/types/MyContext";
import { yooKassaApiKey } from "../../../../config";
import { v4 as uuidv4 } from "uuid";
import { parseString } from "xml2js";

export async function handleRussianCardPayment(
  ctx: MyContext,
  message_id?: number
) {
  // Удаляем предыдущее сообщение
  if (ctx.chat && message_id) {
    await ctx.telegram.deleteMessage(ctx.chat.id, message_id);
  }

  // Получаем курс валют (GEL -> RUB). Это пример и вам, возможно, придется найти другой API для курсов валют.
  let rate = 35;
  try {
    const response = await axios.get(
      "https://www.cbr.ru/scripts/XML_daily.asp"
    ); // Замените на реальный URL
    parseString(response.data, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        return;
      }

      const valutes = result.ValCurs.Valute;
      const gelValute = valutes.find(
        (valute: any) => valute.CharCode && valute.CharCode[0] === "GEL"
      );

      if (gelValute) {
        const gelRate = parseFloat(gelValute.Value[0].replace(",", "."));
        rate = gelRate;
      } else {
        console.log("GEL not found in the data.");
      }
    });
  } catch (error) {
    console.error("Ошибка при получении курса валют:", error);
    await ctx.reply("Ошибка при определении курса валют. Попробуйте ещё раз.");
    return;
  }

  // Приводим сумму к рублям
  const totalPriceInGel = ctx.session.totalPrice;
  const totalPriceInRub = totalPriceInGel * rate;

  const currency = "RUB"; // Берём валюту из сессии
  const chatId = ctx.chat?.id.toString(); // ID чата как строка

  const shortUuid = uuidv4().slice(0, 8); // Генерируем короткий UUID

  const payload = `${currency}&${chatId}&${shortUuid}`; // Формируем payload

  await ctx.replyWithInvoice({
    title: "Ваш заказ",
    description: "Описание заказа",
    payload, // Используем сформированный payload
    provider_token: yooKassaApiKey, // Замените на ваш токен провайдера от YooKassa
    start_parameter: "test",
    currency: "RUB",
    need_shipping_address: true,
    is_flexible: true,
    prices: [
      { label: "Сумма заказа", amount: Math.floor(totalPriceInRub * 100) },
    ], // В копейках
  });

  // Ожидаем оплату и обрабатываем ее в соответствующем обработчике
  // Например, в 'action' или 'on' вашего бота, обрабатывающего успешные или неуспешные оплаты
}
