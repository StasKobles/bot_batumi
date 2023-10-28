import { smartGlocalApiKey } from "../../../../config";
import { MyContext } from "../../../../models/types/MyContext";
import { v4 as uuidv4 } from "uuid";
import { CartItem } from "../../../../models/types/Session";

export async function handleGeorgianCardPayment(
  ctx: MyContext,
  message_id?: number
) {
  // Удаляем предыдущее сообщение
  if (ctx.chat && message_id) {
    await ctx.telegram.deleteMessage(ctx.chat.id, message_id);
  }

  // Приводим сумму к рублям

  const currency = "GEL";
  const chatId = ctx.chat?.id.toString(); // ID чата как строка

  const shortUuid = uuidv4().slice(0, 8); // Генерируем короткий UUID

  const payload = `${currency}&${chatId}&${shortUuid}`; // Формируем payload

  const cartItems: CartItem[] = ctx.session.cart;
  const descriptionItems = cartItems
    .map(
      (item) =>
        `${item.quantity} x ${item.name} = ${item.price * item.quantity} GEL`
    )
    .join("\n");
  const totalPriceInGel = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const description = `${ctx.t("yourOrder")}:\n${descriptionItems}\n${ctx.t(
    "orderSum"
  )}: ${totalPriceInGel} GEL`;
  const prices = cartItems.map((item) => {
    return {
      label: `${item.quantity} x ${item.name}`,
      amount: Math.floor(item.price * item.quantity * 100), // Умножаем на 100, чтобы конвертировать в копейки
    };
  });

  // Создаем инвойс через Telegram Payments
  await ctx.replyWithInvoice({
    title: ctx.t("yourOrder"),
    description: description,
    payload,
    provider_token: smartGlocalApiKey, // Замените на ваш токен провайдера от YooKassa
    start_parameter: "test",
    currency: "GEL",
    need_shipping_address: true,
    is_flexible: true,
    need_name: true,
    prices: prices,
  });

  // Ожидаем оплату и обрабатываем ее в соответствующем обработчике
  // Например, в 'action' или 'on' вашего бота, обрабатывающего успешные или неуспешные оплаты
}
