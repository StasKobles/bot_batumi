import { Telegraf, session } from "telegraf";
import { setupAddressHandlers } from "./commands/cart/callback/addressInputHandler";
import { handlerShippingQuery } from "./commands/cart/callback/paymentsMethods/handlerShippingQuery";
import { cartCommand } from "./commands/cart/cart";
import { productsCommand } from "./commands/products/products";
import { startCommand } from "./commands/start/startCommand";
import { botToken } from "./config";
import { setupSession } from "./config/setupSession";
import { MyContext } from "./models/types/MyContext";
import { createCallbackQuery } from "./utils/callbackQuery/callbackQuery";
import { handlerSuccessfulPayment } from "./commands/cart/callback/paymentsMethods/handlerSuccessfulPayment";

const bot = new Telegraf<MyContext>(botToken);

bot.use(session());
bot.use(setupSession);
createCallbackQuery(bot);

startCommand(bot);
productsCommand(bot);
cartCommand(bot);

handlerShippingQuery(bot);
handlerSuccessfulPayment(bot);

setupAddressHandlers(bot);
bot.launch();
